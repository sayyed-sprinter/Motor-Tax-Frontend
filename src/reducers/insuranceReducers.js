import {
  INSURANCE_FETCH_FAIL,
  INSURANCE_FETCH_REQUEST,
  INSURANCE_FETCH_SUCCESS,
  INSURANCE_LATEST_FETCH_FAIL,
  INSURANCE_LATEST_FETCH_REQUEST,
  INSURANCE_LATEST_FETCH_SUCCESS,
  INSURANCE_POST_FAIL,
  INSURANCE_POST_REQUEST,
  INSURANCE_POST_SUCCESS,
  INSURANCE_REPORT_FETCH_FAIL,
  INSURANCE_REPORT_FETCH_REQUEST,
  INSURANCE_REPORT_FETCH_RESET,
  INSURANCE_REPORT_FETCH_SUCCESS,
} from '../constants/insuranceConstants';

export const newInsuranceCompanyReducers = (
  state = { insuranceCompanies: {} },
  action
) => {
  switch (action.type) {
    case INSURANCE_POST_REQUEST:
      return { loading: true };
    case INSURANCE_POST_SUCCESS:
      return { loading: false, insuranceCompanies: action.payload };
    case INSURANCE_POST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const insuranceReducers = (
  state = { insuranceCompanies: [] },
  action
) => {
  switch (action.type) {
    case INSURANCE_FETCH_REQUEST:
      return { loading: true };
    case INSURANCE_FETCH_SUCCESS:
      return { loading: false, insuranceCompanies: action.payload };
    case INSURANCE_FETCH_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const latestInsuranceReducers = (
  state = { insuranceCompanies: [] },
  action
) => {
  switch (action.type) {
    case INSURANCE_LATEST_FETCH_REQUEST:
      return { loading: true };
    case INSURANCE_LATEST_FETCH_SUCCESS:
      return { loading: false, insuranceCompanies: action.payload };
    case INSURANCE_LATEST_FETCH_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const insuranceReportReducer = (state = {}, action) => {
  switch (action.type) {
    case INSURANCE_REPORT_FETCH_REQUEST:
      return { loading: true };
    case INSURANCE_REPORT_FETCH_SUCCESS:
      return {
        loading: false,
        success: true,
        report_details: action.payload,
      };
    case INSURANCE_REPORT_FETCH_FAIL:
      return { loading: false, error: action.payload, success: false };
    case INSURANCE_REPORT_FETCH_RESET:
      return { report_details: {}, success: false };
    default:
      return state;
  }
};
