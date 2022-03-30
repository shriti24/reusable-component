import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { BaseCSSProperties } from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Grid } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { createTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { convertDate } from '../../../utils/helperFunctions';

import LockClosedIcon from '../../../icons/LockClosedIcon';

const theme = createTheme({
  overrides: {
    MuiCardContent: {
      root: {
        padding: '11px',
        '&:last-child': {
          paddingBottom: '5px'
        }
      }
    },
    MuiTooltip: {
      tooltip: {
        backgroundColor: '#323a4e'
      }
    }
  }
});

interface StyleProps {
  root: BaseCSSProperties;
  hoverCard: BaseCSSProperties;
  cardContent: BaseCSSProperties;
  iconBtn: BaseCSSProperties;
  actionIcons: any;
  lockIcon: BaseCSSProperties;
  lockIconRow: BaseCSSProperties;
  futureRow: BaseCSSProperties;
  verticalSeperator: BaseCSSProperties;
  dotIcon: any;
}

// type PropsClasses = Record<keyof StyleProps, string>

let baseStyle: StyleProps = {
  root: {
    maxWidth: 345,
    margin: '6px 20px 10px 20px'
    // boxShadow: '0px 0px 0px 0px rgba(0,0,0,0.2), 0px 0px 6px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)'
  },
  hoverCard: {
    background: '#E9F5FF'
  },
  cardContent: {
    fontWeight: 'bold'
  },
  iconBtn: {
    marginTop: '-10px'
  },
  actionIcons: {
    color: '#0071e9',
    '&:hover': {
      background: '#E9F5FF !important',
      height: '24px',
      width: '24px',
      borderRadius: '4px'
    }
  },
  lockIcon: {
    fontSize: '1.25rem',
    color: '#424242'
  },
  lockIconRow: {
    padding: '8px'
  },
  futureRow: {
    background: 'white !important',
    borderRadius: '15%',
    right: '25px'
  },
  verticalSeperator: {
    position: 'absolute',
    borderLeft: '1px solid #b3b3b3',
    height: '39px',
    right: '29px'
  },
  dotIcon: {
    color: '#b3b3b3'
  }
};
// const useStyles: StyleProps = makeStyles(() => ({

// }));
const useStyles = makeStyles<Theme, StyleProps>(() => baseStyle as any);

const LockCard = (props) => {
  const classes = useStyles({} as StyleProps);
  // const classes = useStyles();
  const [iconHover, setIconHover] = useState(false);
  const [listHover, setListHover] = useState(false);

  const handleIconHover = (): void => {
    setIconHover(true);
  };

  const handleIconLeave = (): void => {
    setIconHover(false);
  };

  const handleListHover = (): void => {
    setListHover(true);
  };

  const handleListLeave = (): void => {
    setListHover(false);
  };

  const checkEndDate = (date: string): string => {
    if (date && date !== '2049-12-31') {
      date = convertDate(date);
      return ` - ${date}`;
    }
    return '';
  };

  const displayBlockedMessage = (blockMessage: string): string => {
    if (blockMessage === 'Temp Price') return 'Temporary Price Reduction';
    else if (blockMessage === 'Investment') return 'Price Investment';
    else return blockMessage;
  };

  const blockReasonCodeText = props.lock.blockReasonCodeTxt;
  return (
    <MuiThemeProvider theme={theme}>
      <Card
        className={`${classes.root} ${listHover && classes.hoverCard}`}
        onMouseEnter={handleListHover}
        onMouseLeave={handleListLeave}
      >
        <CardContent data-testid="test-cardcontent-id">
          <Grid container>
            <Grid xs={2}>
              <IconButton className={classes.iconBtn}>
                <LockClosedIcon
                  className={classes.lockIcon}
                  fill="#424242"
                  width={16}
                  height={16}
                />
              </IconButton>
            </Grid>
            <Grid xs={8}>
              <span className={classes.cardContent}>
                {displayBlockedMessage(blockReasonCodeText)}
              </span>
              <p style={{ lineHeight: '0px', color: '#545f7a' }}>
                {convertDate(props.lock.startDate)} {checkEndDate(props.lock.endDate)}
              </p>
            </Grid>
            {blockReasonCodeText.toLowerCase() !== 'markdown' && !props.hideKebabMenu ? (
              <Grid xs={2}>
                <IconButton
                  data-testid="test-iconbutton-id"
                  className={`${classes.lockIconRow} ${iconHover && classes.futureRow}`}
                  style={{ right: iconHover && props.status === 'Active' && '25px' }}
                  onMouseEnter={handleIconHover}
                  onMouseLeave={handleIconLeave}
                >
                  {iconHover && props.status === 'Future' ? (
                    <React.Fragment>
                      <span className={classes.verticalSeperator} />
                      <Tooltip title="Delete">
                        <DeleteIcon
                          data-testid={'delete-icon'}
                          className={classes.actionIcons}
                          onClick={() =>
                            props.onHandleDeleteLock(
                              props.status,
                              props.lock,
                              props.club,
                              props.item
                            )
                          }
                          viewBox="0 0 24 24"
                        />
                      </Tooltip>
                      <Tooltip title="Edit">
                        <EditIcon
                          data-testid={'edit-icon'}
                          className={classes.actionIcons}
                          onClick={() => props.handleEditLock(props.lock, props.status)}
                          viewBox="0 0 24 24"
                        />
                      </Tooltip>
                    </React.Fragment>
                  ) : null}
                  {iconHover && props.status === 'Active' ? (
                    <React.Fragment>
                      <span className={classes.verticalSeperator} />
                      <Tooltip title="Delete">
                        <DeleteIcon
                          data-testid={'active-delete-icon'}
                          className={classes.actionIcons}
                          onClick={() =>
                            props.onHandleDeleteLock(
                              props.status,
                              props.lock,
                              props.club,
                              props.item
                            )
                          }
                          viewBox="0 0 24 24"
                        />
                      </Tooltip>
                      {props.lock.blockReasonCode !== 'PII' && (
                        <Tooltip title="Edit">
                          <EditIcon
                            data-testid="test-edit-id"
                            className={classes.actionIcons}
                            onClick={() => props.handleEditLock(props.lock, props.status)}
                            viewBox="0 0 24 24"
                          />
                        </Tooltip>
                      )}
                    </React.Fragment>
                  ) : null}
                  <MoreVertIcon
                    className={`${iconHover && classes.dotIcon} ${
                      !iconHover && classes.actionIcons
                    }`}
                  />
                </IconButton>
              </Grid>
            ) : null}
          </Grid>
        </CardContent>
      </Card>
    </MuiThemeProvider>
  );
};

export default LockCard;
