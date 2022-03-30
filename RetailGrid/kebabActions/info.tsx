import React, { useState, useEffect } from 'react';
import { Button, Grid } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import clsx from 'clsx';
import { Container } from '@material-ui/core';
import useStyles from './useStyles';
import { useRouter } from 'next/router';
import { IDrawerRetail } from '../../../types/Retails';
import { setDecimalPlaces } from '../../../utils/helperFunctions';
import { getSingleCompRule } from '../../../services/compRuleService';
import ProgressBar from '../../../components/common/ProgressBar';
import Can from '../../../components/Can';
import { staticPermission } from '../../../constants/RoleBaseRules';
import { useTranslation } from 'react-i18next';

type InfoProps = {
  isDrawerOpen: boolean;
  data: IDrawerRetail;
  createRetail: (data: any, values: any, effectiveDate: string, expirationDate: string) => void;
  itemDescription: string;
  handleAlertOpen: (msg: string, type?: string) => void;
  onClose: () => void;
  toggleFilterType: (filterType: number) => void;
};

const Info: React.FC<InfoProps> = (props) => {
  const { t } = useTranslation();
  const classes = useStyles({});
  const router = useRouter();
  const [values, setValues] = useState({
    competitor: '',
    spread: '',
    floor: '',
    createdBy: '',
    ruleId: ''
  });

  const [compRulesLoading, setCompRulesLoading] = useState(true);
  const fetchCompRules = async () => {
    try {
      const { data: ruleDetails } = await getSingleCompRule(props.data.itemNbr, props.data.clubNbr);
      if (ruleDetails) {
        const { compName, spreadPercent, floorPercent, creatorId, ruleId } =
          ruleDetails.ruleList[0];
        setValues({
          competitor: compName,
          spread: spreadPercent,
          floor: floorPercent,
          createdBy: creatorId,
          ruleId: ruleId
        });
      }
    } catch (error) {
      console.log('error while fetching single comp rule', error);
    }
    setCompRulesLoading(false);
  };
  useEffect(() => {
    fetchCompRules();
  }, []);

  const viewRule = (values) => {
    props.toggleFilterType(1);
    router.push(`/comp-rules/rule-details?ruleid=${values.ruleId}`);
  };

  return (
    <React.Fragment>
      <Button
        size="large"
        className={classes.clearButton}
        onClick={props.onClose}
        startIcon={<ClearIcon />}
      />
      <div className={classes.DrawerHeader}>
        <InfoOutlinedIcon fontSize="default" className={classes.tabHeaderIcon} />
        Info
      </div>
      <div className={classes.root}>
        <Container className={classes.form}>
          <Grid container spacing={3} className={classes.item}>
            <Grid item xs={12} className={classes.itemText}>
              <span className={classes.formText}> Item:</span>
              <span> {props.data.itemNbr} </span>
            </Grid>
            <Grid item xs={12} className={clsx(classes.itemText, classes.item)}>
              <span className={classes.formText}> Description:</span>
              <span> {props.itemDescription} </span>
            </Grid>
            <Grid item xs={12} className={classes.itemText}>
              <span className={classes.formText}> Status:</span>
              <span> {props.data.status} </span>
            </Grid>
            <Grid item xs={12} className={classes.itemText}>
              <span className={classes.formText}> Club:</span>
              <span> {props.data.clubNbr} </span>
            </Grid>
            <Grid item xs={12} className={classes.itemText}>
              <span className={classes.formText}> {t('retailsPage.retailPrice')}: </span>
              <span> ${setDecimalPlaces(props.data.baseRetailPrice)} </span>
            </Grid>
          </Grid>
        </Container>
      </div>
      {compRulesLoading ? (
        <div className={classes.loader}>
          <ProgressBar />
        </div>
      ) : (
        <div className={classes.root}>
          {values.competitor !== '' && (
            <Container data-testid="club-competitor-rule-container" className={classes.form}>
              <div className={classes.compHeader}>Club Competitor rule</div>
              <Grid container spacing={3} className={classes.item}>
                <Grid item xs={12} className={classes.itemText}>
                  <span className={classes.formText}> Competitor:</span>
                  <span> {values.competitor} </span>
                </Grid>
                <Grid item xs={12} className={classes.itemText}>
                  <span className={classes.formText}> Description:</span>
                  <span>
                    {' '}
                    Gap {values.spread}% | Floor {values.floor}%{' '}
                  </span>
                </Grid>
                <Grid item xs={12} className={classes.itemText}>
                  <span className={classes.formText}> {t('retailsPage.retailAfterRule')}:</span>
                  <span> ${setDecimalPlaces(props.data.retailAmount)} </span>
                </Grid>
                <Grid item xs={12} className={classes.itemText}>
                  <span className={classes.formText}> Created by:</span>
                  <span> {values.createdBy} </span>
                </Grid>
              </Grid>
            </Container>
          )}
        </div>
      )}

      <div className={classes.navButtons}>
        <Button
          variant="outlined"
          color="primary"
          className={classes.backButton}
          onClick={props.onClose}
        >
          Cancel
        </Button>
        {values.competitor !== '' && (
          <Can
            perform={staticPermission.RULES_PAGE}
            yes={() => (
              <Button
                variant="contained"
                color="primary"
                className={classes.saveButton}
                onClick={() => viewRule(values)}
              >
                View Rule
              </Button>
            )}
            no={() => <></>}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default Info;
