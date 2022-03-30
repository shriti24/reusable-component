import React, { FC, useEffect, useState } from 'react';
import { Data } from '../contextAPI';
import Styles from './layout.module.css';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { getSingleCompRule } from '../../../services/compRuleService';
import ProgressBar from '../../../components/common/ProgressBar';
import { GridContextAPI } from '../contextAPI';
import Button from '../../common/ts/CustomButton';
import { useRouter } from 'next/router';
import Can from '../../../components/Can/permission';
import { staticPermission, USER_ACTIONS } from '../../../constants/RoleBaseRules';
import InfoItemLayout from './InfoItemLayout';
import InfoClubLayout from './InfoClubLayout';
import useToastFeature from '@utils/useToastFeature';

const InfoLayout: FC<Data> = (data) => {
  const { t } = useTranslation();
  const _gridContext = React.useContext(GridContextAPI);
  const [values, setValues] = useState({
    competitor: '',
    spread: '',
    floor: '',
    createdBy: '',
    ruleId: '',
    retailAmount: '',
    customerRetailAmt: ''
  });
  const [showCompetitor, setShowCompetitor] = useState(true);
  const { addAlert } = useToastFeature();
  const [compRulesLoading, setCompRulesLoading] = useState(true);
  const router = useRouter();
  const fetchCompRules = async () => {
    try {
      const { data: ruleDetails } = await getSingleCompRule(data.itemNbr, data.clubNbr);
      if (ruleDetails) {
        const { compName, spreadPercent, floorPercent, creatorId, ruleId } =
          ruleDetails.ruleList[0];
        setValues({
          competitor: compName,
          spread: spreadPercent,
          floor: floorPercent,
          createdBy: creatorId,
          ruleId: ruleId,
          retailAmount: data.retailAmount,
          customerRetailAmt: data.customerRetailAmt
        });
      }
    } catch (error) {
      addAlert(error, 'error');
    }
    setCompRulesLoading(false);
  };
  useEffect(() => {
    fetchCompRules();
  }, []);
  const viewRule = (values) => {
    //props.toggleFilterType(1);
    router.push(`/comp-rules/rule-details?ruleid=${values.ruleId}`);
  };
  return (
    <div>
      <div className={Styles.form}>
        <InfoItemLayout {...data} />
        {compRulesLoading && values.competitor === '' ? (
          <div className={Styles.loader}>
            <ProgressBar />
          </div>
        ) : (
          values.competitor !== '' && <InfoClubLayout {...values} />
        )}
      </div>
      <div className={Styles.navButtons}>
        <Button variant="outlined" type="primary" onClick={_gridContext.close} disabled={false}>
          Cancel
        </Button>
        {values.competitor !== '' && (
          <Can
            perform={staticPermission.RULES_PAGE_PATH}
            permission={USER_ACTIONS.VIEW}
            yes={() => (
              <Button
                variant="contained"
                type="primary"
                disabled={false}
                onClick={() => viewRule(values)}
              >
                View Rule
              </Button>
            )}
            no={() => <></>}
          />
        )}
      </div>
    </div>
  );
};
export default InfoLayout;
