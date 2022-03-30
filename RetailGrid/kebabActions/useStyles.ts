import { makeStyles, Theme } from '@material-ui/core';

const drawerWidth = 335;
/* eslint-disable */
export default makeStyles<Theme>(
  (theme: Theme) =>
    ({
      root: {
        display: 'flex',
        zIndex: 100001,
        '& .MuiFormControl-root': {
          '& .Mui-disabled': {
            backgroundColor: '#e9ecf2'
          }
        }
      },
      childContainer: {
        width: '100%',
        height: '100%'
      },
      drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap'
      },
      drawerOpen: {
        width: drawerWidth,
        boxShadow: '-3px 3px 3px #ccc',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen
        })
      },
      drawerClose: {
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9) + 1
        }
      },
      exit: {
        margin: 10,
        opacity: 0.7,
        backgroundImage: 'none',
        outline: 0,
        boxShadow: 'none'
      },
      editIcon: {
        color: theme.palette.primary.main,
        margin: '0 10px 0 11px'
      },
      DrawerHeader: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '20px',
        lineHeight: '28px',
        display: 'flex',
        alignItems: 'center'
      },
      tabHeaderIcon: {
        color: theme.palette.primary.main,
        margin: '0 7px 0 17px',
        '&:hover': {
          background: '#E9F5FF !important',
          borderRadius: '4px'
        }
      },
      slideOutHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 15px 0 0'
      },
      form: {
        width: '100%',
        flexGrow: 1,
        textAlign: 'left',
        backgroundColor: '#fff'
      },
      item: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
      },
      paper: {
        padding: theme.spacing(0)
      },
      title: {
        padding: '20px 0 20px 0'
      },
      action: {
        float: 'right',
        textDecoration: 'none',
        color: theme.palette.secondary.main,
        '&:visited': {
          color: theme.palette.secondary.main
        },
        '&:hover': {
          color: theme.palette.secondary.main,
          transition: 'color 0.25s ease'
        },
        height: '16px',
        fontFamily: 'Roboto',
        fontSize: '14px',
        fontWeight: '500',
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        marginTop: '5px'
      },
      titleDivider: {
        marginLeft: -theme.spacing(3),
        marginRight: -theme.spacing(3)
      },
      subHeader: {
        paddingBottom: theme.spacing(2)
      },
      subHeaderText: {
        fontSize: 16
      },
      infoText: {
        fontSize: 14,
        color: '#545f7a'
      },
      helperText: {
        height: '16px',
        fontFamily: 'Roboto',
        fontSize: '14px',
        fontWeight: '500',
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        color: '#212121',
        marginBottom: '5px'
      },
      itemText: {
        height: '16px',
        fontFamily: 'Roboto',
        fontSize: '14px',
        fontWeight: 'normal',
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        color: '#212121',
        marginBottom: '5px'
      },
      clearButton: {
        justifyContent: 'flex-end'
      },
      backButton: {
        height: theme.spacing(5),
        paddingRight: theme.spacing(5),
        paddingLeft: theme.spacing(5),
        marginRight: theme.spacing(3),
        borderRadius: 4
      },
      saveButton: {
        height: theme.spacing(5),
        paddingRight: theme.spacing(6),
        paddingLeft: theme.spacing(6),
        borderRadius: 4
      },
      lockInfo: {
        whiteSpace: 'normal',
        marginTop: '30px',
        fontSize: '12px',
        display: 'flex'
      },
      lockButton: {
        height: theme.spacing(5),
        borderRadius: 4,
        left: '10%'
      },
      noLockText: {
        fontWeight: '500'
      },
      navButtons: {
        marginTop: 'auto',
        display: 'flex',
        paddingBottom: '18px',
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3)
      },
      formText: {
        color: '#545F7A'
      },
      addIcon: {
        color: theme.palette.primary.main,
        marginLeft: '17px',
        '&:hover': {
          background: '#E9F5FF !important',
          height: '24px',
          width: '24px',
          borderRadius: '4px'
        }
      },
      gridBlock: {
        minWidth: '100%',
        '& .MuiOutlinedInput-root': {
          '& button': {
            backgroundColor: 'transparent !important'
          }
        }
      },
      errorBlock: {
        minWidth: '100%',
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'red'
          }
        }
      },
      compHeader: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '20px',
        lineHeight: '28px',
        height: '28px',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '0px',
        marginTop: '23px'
      },
      infoBlockText: {
        lineHeight: '0px',
        color: '#545F7A',
        fontWeight: '400',
        fontSize: '13px',
        paddingLeft: '7px'
      },
      card: {
        marginLeft: '-46px'
      },
      endDateTag: {
        color: '#0071e9',
        fontWeight: '500',
        display: 'flex'
      },
      endDateText: {
        lineHeight: '0px'
      },
      loader: {
        margin: '40px auto'
      },
      iconHover: {
        '& + span': {
          marginLeft: theme.spacing(1)
        },
        '&:hover': {
          background: '#E9F5FF',
          borderRadius: '4px'
        },
        '&[disabled]': {
          opacity: 0.5,
          pointerEvents: 'none',
          color: 'rgba(0, 0, 0, 0.26) !important'
        }
      }
    } as any)
);
