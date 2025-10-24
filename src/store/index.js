import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import axios from 'axios'
import _ from 'lodash'
import {
  EMAIL_QUESTION, IMPROVEMENT_QUESTION,
  OUTPUT_TYPE,
  QUESTION_TYPE, SHOP_SELECT_QUESTION,
  STEP1_QUESTIONS,
  STEP2_QUESTIONS, STEP3_IMAGE_TEST_QUESTIONS, STEP3_REVIEW_VOTE_QUESTIONS,
  STEP3_STATIC_QUESTIONS, STEP4_QUESTIONS
} from '../constants/questions';
import i18n from '../i18n';

Vue.use(Vuex);

const config = require("@/lib/config.yml");
const apiEndpoint = config.apiEndpoint;
const brands = config.brands.map(file => {
  return require(`@/lib/brands/${file}`);
});

export default new Vuex.Store({
  state: {
    allBrandNames: brands.map(item => item.name),
    form: {},
    step: 0,
    brand: '',
    apiEndpoint,
    products: null,
    pProducts: null,
    randNumber: 99,
    sendLimit: null,
    imageTest: null,
    reviewVote: null,
  },
  getters: {
    brandInfo: (state) => {
      const target = brands.find(brand => {
        return state.brand == brand.name;
      });
      if (target) {
        return target;
      }
      return null;
    },
    productInfo: (state) => {
      if (state.form.sku && state.form.sku.length > 0 && state.products && state.products.length > 0) {
        const target = state.products.find(p => {
          return p.sku == state.form.sku;
        });
        if (target) {
          return target;
        }
      }
      return null;
    },
    sku: (stage, getters) => {
      return _.get(getters, ['productInfo', 'sku'], null)
    },
    skuQuestions: (state, getters) => {
      const sku = _.get(getters, ['productInfo', 'sku'], null)
      const skuQuestionData = _.get(getters, ['brandInfo', 'skuQuestions'], []).find(data => data.sku === sku)
      return _.get(skuQuestionData, 'questions', [])
    },
    currentSkuTodaysReviewCount: (state, getters) => {
      return state.sendLimit && state.sendLimit[3] != null ? state.sendLimit[3] : 0
    },
    imageTest:(state, getters) => {
      if(!state.imageTest) return null
      return _.get(_.groupBy(state.imageTest.slice(1), item => item[0]), getters.sku, null)
    },
    reviewVote:(state, getters) => {
      if(!state.reviewVote) return null
      return _.get(_.groupBy(state.reviewVote.slice(1), item => item[0]), getters.sku, null)
    },
    questions: (state,getters) => {
      const step3Questions = [..._.get(getters.brandInfo, ['questions'], []), ..._.get(getters, 'skuQuestions', [])]
        .map(q => ({
          ...q,
          displayPage: 'step3',
          questionType: QUESTION_TYPE.question,
          outputType: OUTPUT_TYPE.question,
        }))

      const questions = [
        ...getters.brandInfo.shops.length === 1 ? [] : [SHOP_SELECT_QUESTION],
        ...STEP1_QUESTIONS,
        ...getters.brandInfo.emailInStep1 ? [{ ...EMAIL_QUESTION, displayPage: 'step1' }] : [],
        ...STEP2_QUESTIONS,
        ...step3Questions,
        ...STEP3_STATIC_QUESTIONS,
        ...getters.reviewVote ? STEP3_REVIEW_VOTE_QUESTIONS : [],
        ...getters.imageTest ? STEP3_IMAGE_TEST_QUESTIONS : [],
        ...STEP4_QUESTIONS,
        ...getters.brandInfo.addImprovementComment ? [IMPROVEMENT_QUESTION] : [],
        ...getters.brandInfo.emailInStep1 ? [] : [EMAIL_QUESTION],
      ]
      return questions.map((q, idx) => {
        return {
          questionIndex: idx,
          id: `q${idx + 1}`,
          ...q,
        }
      });
    }
  },
  mutations: {
    initRandNumber(state) {
      // 0-99
      state.randNumber = Math.floor(Math.random() * 100);
    },
    saveForm(state, payload) {
      Object.keys(payload).forEach(key => {
        Vue.set(state.form, key, payload[key]);
      })
    },
    saveStep(state, step) {
      state.step = step;
    },
    setBrand(state, brandName) {
      const isValid = brands.some(b => b.name === brandName);
      state.brand = isValid ? brandName : null;
    },
    saveProducts(state, items) {
      state.products = items;
    },
    saveTargetProducts(state, items) {
      state.pProducts = items;
    },
    saveSendLimit(state, sendLimit) {
      state.sendLimit = sendLimit
    },
    saveImageTest(state, payload) {
      state.imageTest = payload
    },
    saveReviewVote(state, payload) {
      state.reviewVote = payload
    },
  },
  actions: {
    getProducts({ state, commit }, brand) {
      axios(`${state.apiEndpoint}?type=products&brand=${brand}`).then(res => {
        if (res && res.data && res.data.success && res.data.data) {
          const data = res.data.data;
          const fields = data[0];
          let ret = [];
          data.forEach((vals, idx) => {
            if (idx > 0) {
              const obj = {};
              fields.forEach((field, cid) => {
                obj[field] = vals[cid];
              });
              ret.push(obj);
            }
          });
          commit('saveProducts', ret);
        }
      });
    },
    async checkOrderNumber({ state, commit }, { orderNumber, channel }) {
      const res = await axios(`${state.apiEndpoint}?type=order&brand=${state.brand}&q=${orderNumber}`)
      let existsOrderNumber = false
      let purchasedOverOneWeekAgo = false

      if (res && res.data && res.data.data) {
        const data = res.data.data;
        const headerRow = data[0];
        const orderIdIndex = headerRow.findIndex(row => row === 'order-id')
        const channelIndex = headerRow.findIndex(row => row === 'channel')
        const purchaseDateIndex = headerRow.findIndex(row => row === 'purchase-date')
        const targetRows = data.filter(row => String(row[orderIdIndex]) === orderNumber && row[channelIndex] === channel)
        if(targetRows.length) {
          existsOrderNumber = true
          const purchased = moment(targetRows[0][purchaseDateIndex]);
          const today = moment();
          const days = today.diff(purchased, "days");

          purchasedOverOneWeekAgo = days >= 7
          if (purchasedOverOneWeekAgo) {
            const products =  targetRows.map((row, i) => {
              const obj = {}
              row.forEach((item, i) => {
                obj[headerRow[i]] = item
              })
              return obj
            })

            commit("saveTargetProducts", products);
          }
        }
      }

      return {
        existsOrderNumber,
        purchasedOverOneWeekAgo,
      }
    },
    getSendLimit({ state, getters, commit }) {
      const todayYYYYMMDD = moment().format('YYYY-MM-DD')
      if(getters.productInfo) {
        return axios(`${state.apiEndpoint}?type=sendlimit&brand=${state.brand}&sku=${getters.productInfo.sku}&date=${todayYYYYMMDD}&rate=${state.form.satisfaction}`).then(res => {
          if (res && res.data && res.data.success && res.data.data) {
            commit('saveSendLimit', res.data.data)
          }
        });
      }
    },
    getImageTest({ state, getters, commit }) {
      return axios(`${state.apiEndpoint}?type=reviewvote&brand=${state.brand}`).then(res => {
        if (res && res.data && res.data.success && res.data.data) {
          commit('saveReviewVote', res.data.data)
        }
      });
    },
    getReviewVote({ state, getters, commit }) {
      return axios(`${state.apiEndpoint}?type=imagetest&brand=${state.brand}`).then(res => {
        if (res && res.data && res.data.success && res.data.data) {
          commit('saveImageTest', res.data.data)
        }
      });
    },
    sendSendLimit({state, getters}) {
      const sku = _.get(getters, ['productInfo', 'sku'], null)
      const rate = state.form.satisfaction
      if(!sku || !rate) return
      const params = {
        type: 'sendlimit',
        date: moment().format('YYYY-MM-DD'),
        sku,
        rate,
      }
      return axios({
        method: 'post',
        url: `${state.apiEndpoint}?brand=${state.brand}`,
        data: params,
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        }
      })
    },
    sendForm({ state, getters }, { type, callback, errorCallback }) {
      const params = {
        type: type || 'form',
        satisfaction: (state.form.satisfaction ? state.form.satisfaction : ''),
        'review-check': state.form.reviewCheck ? "checked" : "無",
        'review-content': state.form.reviewContent ? state.form.reviewContent : "無",
        email: state.form.email,
        channel: state.form.channel,
        'gift-type': state.form.gift,
        'order-id': state.form.orderId,
        sku: state.form.sku,
        date: moment().format("YYYY-MM-DD HH:mm:ss")
      };
      const questionTypeIndex = getters.questions.findIndex(q => q.outputType === OUTPUT_TYPE.question)
      const questionTypeItems = getters.questions.filter(q => q.outputType === OUTPUT_TYPE.question)
      questionTypeItems.forEach((q, idx) => {
        const columnIndex = idx + 1
        let formatted = state.form[q.id] || '無'
        if(Array.isArray(formatted)) {
          formatted = formatted.join(',')
        }

        params[`q${columnIndex}-question`] = q.title || i18n.t(q.titleI18n)
        params[`q${columnIndex}-answer`] = formatted
      });
      axios({
        method: 'post',
        url: `${state.apiEndpoint}?brand=${state.brand}`,
        data: params,
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        }
      }).then(res => {
        if (res && res.data && res.data.success && res.data.success == true) {
          callback();
        } else {
          errorCallback();
        }
      }).catch(() => {
        errorCallback();
      })
    }
  }
})
