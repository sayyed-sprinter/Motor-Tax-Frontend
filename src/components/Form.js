import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BiLinkAlt } from 'react-icons/bi';
import { VscLoading } from 'react-icons/vsc';
import Button from './Button';
import { fetchTaxpayerDetails } from '../actions/taxpayerActions';
import {
  fetchInsuranceReportDetails,
  getAllInsuranceCompanies,
} from '../actions/insuranceAction';
import MessageBar from './MessageBar';
import InputTextField from './InputTextField';

const Form = ({ history }) => {
  const dispatch = useDispatch();

  const [insurancePaid, setinsurancePaid] = useState(true);
  const [vehicle_number, setVehicle_number] = useState('');
  const [bluebook_number, setBluebook_number] = useState('');
  const [engine_cc, setEngine_cc] = useState('');
  const [policy_number, setPolicy_number] = useState('');
  const [insurance_company, setInsurance_company] = useState('');
  const [bluebook_file_path, setBluebook_file_path] = useState('');
  const [citizenship_file_path, setCitizenship_file_path] = useState('');
  const [policy_file_path, setPolicy_file_path] = useState('');

  const [fileLoading, setFileLoading] = useState(false);
  const [bluebookLoader, setBluebookLoader] = useState(false);
  const [citizenshipLoader, setCitizenshipLoader] = useState(false);
  const [policyLoader, setPolicyLoader] = useState(false);

  const [bluebookFile, setBluebookFile] = useState('Attach your bluebook copy');
  const [citizenshipFile, setCitizenshipFile] = useState(
    'Attach your citizenship copy'
  );
  const [receipt, setReceipt] = useState(' Attach your insurance receipt copy');

  const record = useSelector((state) => state.taxpayer);
  const { error, success, loading } = record;

  const insurnceReport = useSelector((state) => state.insuranceReport);
  const {
    success: successInsuranceReport,
    loading: loadingInsuranceReport,
    error: errInsuranceReport,
  } = insurnceReport;

  const insComapnies = useSelector((state) => state.insurance);
  const { insuranceCompanies, loading: loadingInsCompanies } = insComapnies;

  // DISPLAY TOOLTIPS
  const showTooltip = (name, type) => {
    if (type === 'bluebook') {
      const blubook = document.querySelector('.tooltip-bluebook');
      blubook.innerText = name;
    }
    if (type === 'citizenship') {
      const ctzn = document.querySelector('.tooltip-citizenship');
      ctzn.innerText = name;
    }
    if (type === 'policy') {
      const plcy = document.querySelector('.tooltip-policy');
      plcy.innerText = name;
    }
  };

  // DISPLAY Loader
  const showLoader = (type) => {
    if (type === 'bluebook') {
      setBluebookLoader(true);
    }
    if (type === 'citizenship') {
      setCitizenshipLoader(true);
    }
    if (type === 'policy') {
      setPolicyLoader(true);
    }
  };

  // SET FILE PATHS
  const setFilePaths = (path, type) => {
    if (type === 'bluebook') {
      setBluebook_file_path(`https://motor-tax.herokuapp.com/${path}`);
    }
    if (type === 'citizenship') {
      setCitizenship_file_path(`https://motor-tax.herokuapp.com/${path}`);
    }
    if (type === 'policy') {
      setPolicy_file_path(`https://motor-tax.herokuapp.com/${path}`);
    }
  };

  useEffect(() => {
    if (success) {
      history.push('/tax-summary');
    }

    if (successInsuranceReport) {
      history.push('/insurance-summary');
    }
    dispatch(getAllInsuranceCompanies());
  }, [success, successInsuranceReport, history, dispatch]);

  const uploadFileHandler = async (e, type) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('documents', file);
    showLoader(type);
    setFileLoading(true);
    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };

      const {
        data: {
          file: { name, path },
        },
      } = await axios.post(
        `https://motor-tax.herokuapp.com/api/uploads/document`,
        formData,
        config
      );

      showTooltip(name, type);

      // ASSIGN NAME
      if (e.target.id === 'citizenship-file') {
        setCitizenshipFile('doc...');
      }
      if (e.target.id === 'receipt-file') {
        setReceipt('doc...');
      }
      if (e.target.id === 'bluebook-file') {
        setBluebookFile('doc...');
      }
      setBluebookLoader(false);
      setCitizenshipLoader(false);
      setPolicyLoader(false);

      // SAVE FILE PATH IN filePath
      setFilePaths(path, type);
    } catch (error) {
      setFileLoading(false);
      console.error(`Error occured: ${error}`);
    }
  };

  const checkInputFields = () => {
    vehicle_number === '' &&
      setVehicle_number(history.location.state.vehicle_number);
    bluebook_number === '' &&
      setBluebook_number(history.location.state.bluebook_number);
    engine_cc === '' && setEngine_cc(history.location.state.engine_cc);
    policy_number === '' &&
      setPolicy_number(history.location.state.policy_number);
  };

  history.location.state !== undefined && checkInputFields();

  const submitTaxDetailsHandler = (e) => {
    e.preventDefault();

    dispatch(
      fetchTaxpayerDetails({
        vehicle_number,
        bluebook_number,
        engine_cc,
        policy_number,
        bluebook_file_path,
        citizenship_file_path,
        policy_file_path,
      })
    );
  };

  const submitInsuranceDetailsHandler = (e) => {
    e.preventDefault();
    dispatch(
      fetchInsuranceReportDetails({
        vehicle_number,
        bluebook_number,
        engine_cc,
        insurance_company,
        bluebook_file_path,
        citizenship_file_path,
      })
    );
  };

  return (
    <section className='form--pay-tax' id='home-screen'>
      {insurancePaid ? (
        <h2 className='heading-1' id='pay-now'>
          Pay Your Tax
        </h2>
      ) : (
        <h2 className='heading-1' id='pay-now'>
          Pay Motor Insurance
        </h2>
      )}

      <form
        action=''
        className='form--grid'
        onSubmit={
          insurancePaid
            ? submitTaxDetailsHandler
            : submitInsuranceDetailsHandler
        }
      >
        <section className='text-box'>
          <InputTextField
            value={
              history.location.state !== undefined
                ? history.location.state.bluebook_number
                : bluebook_number
            }
            setValue={setBluebook_number}
            idValue='bluebook-number'
            classValue='input--text'
            labelName='Bluebook Number'
          />

          <InputTextField
            value={
              history.location.state !== undefined
                ? history.location.state.vehicle_number
                : vehicle_number
            }
            setValue={setVehicle_number}
            idValue='vehicle-number'
            classValue='input--text'
            labelName='Vehicle number'
          />

          <InputTextField
            value={
              history.location.state !== undefined
                ? history.location.state.engine_cc
                : engine_cc
            }
            setValue={setEngine_cc}
            idValue='engine-cc'
            classValue='input--text'
            labelName='Engine displacement (in cc)'
          />

          {insurancePaid ? (
            <InputTextField
              value={
                history.location.state !== undefined
                  ? history.location.state.policy_number
                  : policy_number
              }
              setValue={setPolicy_number}
              idValue='insurance-number'
              classValue='input--text'
              labelName='Insurance policy number'
            />
          ) : (
            <section className='input--text'>
              <label className='label' htmlFor='insurance_company'>
                Select insurance policy
              </label>
              <select
                id='insurance_company'
                name='insurance_company'
                value={insurance_company}
                onChange={(e) => setInsurance_company(e.target.value)}
              >
                <option value=''>Select Insurance Company</option>
                {loadingInsCompanies ? (
                  <option value='New Insurance Company' id='insurance-new'>
                    New Insurance Company
                  </option>
                ) : (
                  insuranceCompanies &&
                  insuranceCompanies.map((item, index) => (
                    <option
                      value={item.insurance_company}
                      id={`insurance-${index}`}
                      key={`insurance-${index}`}
                    >
                      {item.insurance_company}
                    </option>
                  ))
                )}
              </select>
            </section>
          )}
        </section>
        <section className='file-box'>
          <section className='input--file'>
            <BiLinkAlt className='file-icon' />{' '}
            <label
              htmlFor='bluebook-file'
              className='label-file label-bluebook'
            >
              {bluebookFile}
            </label>
            {bluebookLoader && (
              <VscLoading className='loader loader-bluebook' />
            )}
            {fileLoading && (
              <section className='tooltip-box'>
                <span className='tooltip tooltip-bluebook'>
                  No files attached
                </span>
              </section>
            )}
            <input
              type='file'
              name='documents'
              onChange={(e) => uploadFileHandler(e, 'bluebook')}
              id='bluebook-file'
            />
          </section>
          <section className='input--file'>
            <BiLinkAlt className='file-icon' />{' '}
            <label
              htmlFor='citizenship-file'
              className='label-file label-citizenship'
            >
              {citizenshipFile}
            </label>{' '}
            {citizenshipLoader && (
              <VscLoading className='loader loader-citizenship' />
            )}
            {fileLoading && (
              <section className='tooltip-box'>
                <span className='tooltip tooltip-citizenship'>
                  No files attached
                </span>
              </section>
            )}
            <input
              type='file'
              onChange={(e) => uploadFileHandler(e, 'citizenship')}
              id='citizenship-file'
            />
          </section>

          {insurancePaid && (
            <section className='input--file'>
              <BiLinkAlt className='file-icon' />{' '}
              <label htmlFor='receipt-file' className='label-file label-policy'>
                {receipt}
              </label>{' '}
              {policyLoader && <VscLoading className='loader loader-policy' />}
              {fileLoading && (
                <section className='tooltip-box'>
                  <span className='tooltip tooltip-policy'>
                    No files attached
                  </span>
                </section>
              )}
              <input
                type='file'
                onChange={(e) => uploadFileHandler(e, 'policy')}
                id='receipt-file'
              />
            </section>
          )}
        </section>
        <section className='submit-info'>
          {insurancePaid && (
            <p className='no-policy'>
              {' '}
              Not paid Insurance? &nbsp;
              <Link
                to='#'
                className='link-primary'
                id='btn-pay-here'
                onClick={() => setinsurancePaid(!insurancePaid)}
              >
                Pay here
              </Link>
            </p>
          )}{' '}
          {insurancePaid ? (
            loading ? (
              <Button
                text='loading...'
                classes='btn btn--primary btn--pay'
                id='btn-continue'
              />
            ) : (
              <Button
                text='continue'
                classes='btn btn--primary btn--pay'
                id='btn-continue'
              />
            )
          ) : loadingInsuranceReport ? (
            <Button
              text='loading...'
              id='btn-calculate-insurance'
              classes='btn btn--primary btn--pay'
            />
          ) : (
            <Button
              text='calculate'
              id='btn-calculate-insurance'
              classes='btn btn--primary btn--pay'
            />
          )}
        </section>
        {error && error !== 'tax-paid' && (
          <MessageBar error={true} text={error} />
        )}
        {error === 'tax-paid' && (
          <MessageBar text='Tax already paid!' id='tax-already-paid' />
        )}
        {errInsuranceReport && errInsuranceReport !== 'tax-paid' && (
          <MessageBar error={true} text={errInsuranceReport} />
        )}
        {errInsuranceReport === 'tax-paid' && (
          <MessageBar text='Tax already paid!' id='tax-already-paid' />
        )}
      </form>
    </section>
  );
};

export default Form;
