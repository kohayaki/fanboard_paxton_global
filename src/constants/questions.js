import i18n from '../i18n';

export const OUTPUT_TYPE = {
  giftType: 'giftType',
  channel: 'channel',
  orderId: 'order-id',
  sku: 'sku',
  satisfaction: 'satisfaction',
  reviewContent: 'reviewContent',
  reviewCheck: 'reviewCheck',
  email: 'email',
  question: 'question',
}

export const QUESTION_TYPE = {
  shop: 'shop',
  orderId: 'orderId',
  product: 'product',
  email: 'email',
  satisfaction: 'satisfaction',
  reviewContent: 'reviewContent',
  reviewCheck: 'reviewCheck',
  reviewVote: 'reviewVote',
  imageTest: 'imageTest',
  question: 'question',
  improvementComment: 'improvementComment',
}

export const STEP1_QUESTIONS = [
  {
    displayPage: 'step1',
    questionType: QUESTION_TYPE.orderId,
    outputType: OUTPUT_TYPE.orderId,
    titleI18n: 'question.order.title',
    subTitleI18n: 'question.order.subTitle',
    placeholderI18n: 'question.order.placeholder',
    hintI18n: 'question.order.hint',
  },
]

export const STEP2_QUESTIONS = [
  {
    displayPage: 'step2',
    questionType: QUESTION_TYPE.product,
    outputType: OUTPUT_TYPE.sku,
    titleI18n: 'question.product.title',
  },
]

export const STEP3_STATIC_QUESTIONS = [
  {
    displayPage: 'step3',
    questionType: QUESTION_TYPE.satisfaction,
    outputType: OUTPUT_TYPE.satisfaction,
    titleI18n: 'question.satisfaction.title',
    placeholderI18n: 'question.satisfaction.placeholder',
  }
]

export const STEP3_IMAGE_TEST_QUESTIONS = [
  {
    displayPage: 'step3ImageTest',
    questionType: QUESTION_TYPE.imageTest,
    outputType: OUTPUT_TYPE.question,
    titleI18n: 'question.imageTest.title',
  },
]

export const STEP3_REVIEW_VOTE_QUESTIONS = [
  {
    displayPage: 'step3ReviewVote',
    questionType: QUESTION_TYPE.reviewVote,
    outputType: OUTPUT_TYPE.question,
    titleI18n: 'question.reviewVote.title',
  },
]

export const STEP4_QUESTIONS = [
  {
    displayPage: 'step4',
    questionType: QUESTION_TYPE.reviewContent,
    outputType: OUTPUT_TYPE.reviewContent,
    titleI18n: 'question.reviewContent.title',
    subTitleI18n: 'question.reviewContent.subTitle',
    placeholderI18n: 'question.reviewContent.placeholder',
  },
  {
    displayPage: 'step4',
    questionType: QUESTION_TYPE.reviewCheck,
    outputType: OUTPUT_TYPE.reviewCheck,
    titleI18n: 'question.reviewCheck.title',
    subTitleI18n: 'question.reviewCheck.subTitle',
  },
]

export const SHOP_SELECT_QUESTION = {
  displayPage: 'step1',
  questionType: QUESTION_TYPE.shop,
  outputType: OUTPUT_TYPE.channel,
  titleI18n: 'question.shopSelect.title',
}

export const IMPROVEMENT_QUESTION = {
  displayPage: 'step4',
  questionType: QUESTION_TYPE.improvementComment,
  outputType: OUTPUT_TYPE.question,
  titleI18n: 'question.improvement.title',
  placeholderI18n: 'question.improvement.placeholder',
}

export const EMAIL_QUESTION = {
  displayPage: 'step4', // or 1
  questionType: QUESTION_TYPE.email,
  outputType: OUTPUT_TYPE.email,
  titleI18n: 'question.email.title',
  subTitleI18n: 'question.email.subTitle',
  placeholderI18n: 'question.email.placeholder',
}
