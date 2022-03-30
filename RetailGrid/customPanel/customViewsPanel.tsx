import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, RootStateOrAny } from 'react-redux';
import _ from 'underscore';
import styled from 'styled-components';
import KababMenu from '../KababMenu';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Favourite from '../../../icons/favourite';
import Duplicate from '../../../icons/duplicate';
import EditIcon from '@material-ui/icons/Edit';
import FavouriteSelected from '../../../icons/favouriteSelected';
import ListViewIcon from '../../../icons/listView';
import CustomButton from '../../common/ts/CustomButton';
import styles from './custompanel.module.css';
import Can from '../../Can/permission';
import NoAccess from '../../common/NoAccess';
import DialogBox from '../../common/ts/DialogBox';
import { staticPermission, USER_ACTIONS } from '../../../constants/RoleBaseRules';
import {
  setSelectedView,
  setCurrentViewOrder,
  setNavAlert,
  setAllViews,
  setViewsApiError,
  setGridLoaded,
  setGridUpdated,
  setGridItemLength,
  setCompetitorsRetails
} from '../../../actions/selectedViewsActions';
import {
  getAllUserViews,
  commonActions,
  createUserViews,
  renameUserView,
  makeItDefault,
  removeUserView
} from '../../../services/UserViews/userViews_service';
import { viewsResponse } from './mockViews';
import {
  NameGenerator,
  DuplicateNameGenerator,
  duplicateChecker
} from '../../common/HelperFunctions/NameGenerator';
import useToastFeature from '@utils/useToastFeature';
import { NAV_ALERT_MESSAGE_VIEWS, COMPETITOR_VIEWS_MESSAGE } from '../util/constants';

const CustomViewPanel = ({ gridOptions }) => {
  const [disableSaveBtn, setDisableSaveBtn] = useState(true);
  const [views, setViews] = useState([]);
  const [headerName, setHeaderName] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [viewsApiReady, setViewsApiReady] = useState(false);
  const [defaultView, setDefaultView] = useState(false);
  const [refreshViews, setRefreshViews] = useState(false);
  const [detailObject, setDetailObject] = useState({});
  const [newDetailObject, setNewDetailObject] = useState({});
  const [activeName, setActiveName] = useState('');
  const [newViewName, setNewViewName] = useState('');
  const [open, setOpen] = useState(false);
  const [applyViewClicked, setApplyViewClicked] = useState(false);
  const [readyToSave, setReadyToSave] = useState(false);
  const [oldViewState1, setOldViewState1] = useState([]);
  const [firstTimeView, setFirstTimeView] = useState([]);
  const [switchView, setSwitchView] = useState(false);
  const [viewUpdated, setViewUpdated] = useState(false);
  const { addAlert } = useToastFeature();
  const [replaceName, setReplaceName] = useState('');
  const [oldName, setOldName] = useState('');
  const [updatedClickView, setUpdateClickView] = useState(false);
  const [modalProps, setModalProps] = useState({
    title: '',
    firstButton: '',
    secondButton: '',
    content: ''
  });
  const [defaultViewName, setDefaultViewName] = useState('');
  const dispatch = useDispatch();

  const isSelectedView = useSelector((state: RootStateOrAny) => {
    return state.selectedView;
  });
  const columnData = useSelector((state: RootStateOrAny) => {
    return state.common.getColumnRetailData;
  });

  const allViews = useSelector((state: RootStateOrAny) => {
    return state.selectedView.getAllViews;
  });
  /**
   *
   * @param retailColumnView : object of array
   * @description : finding out column width if it null resize particular column
   */
  const autoSizeAll = (retailColumnView: any) => {
    const nullColumnWidthIds =
      retailColumnView &&
      retailColumnView.length &&
      retailColumnView[0].detail &&
      retailColumnView[0].detail?.colState
        ? retailColumnView[0].detail.colState?.map((item: any) => {
            if (item?.width === null) {
              return item.colId;
            }
          })
        : [];
    gridOptions?.columnApi?.autoSizeColumns(nullColumnWidthIds.filter(Boolean));
  };

  const getAllViewsData = async () => {
    const retailEnquiry = '/RETAIL_ENQUIRY';
    const result = await getAllUserViews(retailEnquiry);
    if (result.status === 200) {
      const data = result.preferenceDetails;
      const retailViews = data.filter((item) => item.id === 'RETAIL_ENQUIRY');
      setViews(retailViews);
      setViewsApiReady(true);
      setDefaultView(false);
      setDisableSaveBtn(true);
      dispatch(setSelectedView(retailViews[0].detail));
      dispatch(setAllViews(retailViews));
      dispatch(setViewsApiError(false));
      if (replaceName || newViewName) {
        applyNewView(replaceName ? replaceName : newViewName);
      }
    } else {
      const data = viewsResponse.preferenceDetails;
      const retailViews = data.filter((item) => item.id === 'RETAIL_ENQUIRY');
      setViews(retailViews);
      setViewsApiReady(true);
      setDefaultView(true);
      setDisableSaveBtn(true);
      gridOptions.columnApi.autoSizeAllColumns(); // override default view
    }
  };
  useEffect(() => {
    const columnUpdated = {
      detail: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        colState: gridOptions?.columnApi?.getColumnState(),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        filterState: gridOptions?.api?.getFilterModel()
      }
    };
    if (!_.isEqual(isSelectedView?.getSelectedView, columnUpdated?.detail)) {
      setDisableSaveBtn(false);
      dispatch(setNavAlert(true));
      if (
        isSelectedView.getSelectedView?.colState?.length !== columnUpdated.detail?.colState?.length
      ) {
        dispatch(setCompetitorsRetails(true));
      } else {
        dispatch(setCompetitorsRetails(false));
      }
    } else {
      setDisableSaveBtn(true);
      dispatch(setNavAlert(false));
    }
    dispatch(setCurrentViewOrder(false));
  }, [isSelectedView.isViewOrderChange]);

  useEffect(() => {
    if (refreshViews) {
      getAllViewsData();
      setRefreshViews(false);
    }
  }, [refreshViews]);

  useEffect(() => {
    if (allViews.length) {
      const storedRetailViews = allViews.filter((item) => item.id === 'RETAIL_ENQUIRY');
      if (!storedRetailViews.length) {
        getAllViewsData();
        setRefreshViews(false);
      } else {
        setViews(storedRetailViews);
        setHeaderName(storedRetailViews[0].name);
        setActiveName(storedRetailViews[0].name);
        setSelectedClass(storedRetailViews[0].name.replace(/ /g, ''));
        // autoSizeAll(storedRetailViews);
        setViewsApiReady(true);
        dispatch(setCurrentViewOrder(false));
        setDisableSaveBtn(true);
        dispatch(setSelectedView(storedRetailViews[0].detail));
      }
    }
  }, []);

  useEffect(() => {
    if (isSelectedView.gridLoaded && !isSelectedView.viewsApiError) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      gridOptions.columnApi.setColumnState(firstTimeView?.detail?.colState);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      gridOptions.api.setFilterModel(firstTimeView?.detail?.filterState);
      dispatch(setGridLoaded(false));
      setViewUpdated(true);
    }
  }, [isSelectedView.gridLoaded]);

  useEffect(() => {
    if (viewUpdated || isSelectedView?.gridUpdated) {
      dispatch(setGridItemLength(gridOptions?.api?.getDisplayedRowCount() ? false : true));
      setViewUpdated(false);
      if (
        !_.isEqual(isSelectedView?.getSelectedView?.filterState, gridOptions?.api?.getFilterModel())
      ) {
        setDisableSaveBtn(false);
        dispatch(setNavAlert(true));
      } else {
        setDisableSaveBtn(true);
        dispatch(setNavAlert(false));
      }
      dispatch(setGridUpdated(false));
    }
  }, [viewUpdated, isSelectedView.gridUpdated]);

  useEffect(() => {
    if (viewsApiReady) {
      const hName = views.filter((item) => item.active === true);
      if (hName.length && activeName === '') {
        setHeaderName(hName[0].name);
        setActiveName(views[0].name);
        setSelectedClass(hName[0].name.replace(/ /g, ''));
        const defaultState = findTheSelectedView(views, hName[0].name);
        const defaultItem = Object.assign({}, ...defaultState);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        gridOptions.columnApi.setColumnState(defaultItem?.detail?.colState);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        gridOptions.api.setFilterModel(defaultItem?.detail?.filterState);
        // resize columns
        // autoSizeAll(hName);
      } else {
        setHeaderName(activeName ? activeName : views[0].name);
        setSelectedClass(
          activeName ? activeName.replace(/ /g, '') : views[0].name.replace(/ /g, '')
        );
        const selectedState = findTheSelectedView(views, activeName);
        const selectedItem = Object.assign({}, ...selectedState);
        setFirstTimeView(selectedItem);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        gridOptions.columnApi.setColumnState(selectedItem?.detail?.colState);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        gridOptions.api.setFilterModel(selectedItem?.detail?.filterState);
        // resize columns
        // autoSizeAll(hName);
      }
      setDetailObject({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        colState: gridOptions?.columnApi?.getColumnState(),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        filterState: gridOptions?.api?.getFilterModel()
      });
      setViewsApiReady(false);
    }
  }, [viewsApiReady, isSelectedView.gridLoaded]);

  const generatePayload = (viewName) => {
    return {
      id: 'RETAIL_ENQUIRY',
      name: viewName,
      shareable: false,
      detail: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        colState: gridOptions?.columnApi?.getColumnState(),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        filterState: gridOptions?.api?.getFilterModel()
      }
    };
  };

  const saveView = (viewName) => {
    addAlert(`Saving the new changes in to ${viewName}`);
    const payload = generatePayload(viewName);
    createUserViews(payload)
      .then((response) => {
        if (response.status === 201) {
          getAllViewsData();
          addAlert(`${viewName} created succesfully`, 'success');
          applyNewView(viewName);
        }
      })
      .catch((err) => {
        if (err.response?.data?.errorMessages) {
          addAlert(err.response?.data?.errorMessages[0].message, 'error');
        } else {
          addAlert('Failed to duplicate. Please try again.', 'error');
        }
        setRefreshViews(true);
      });
  };

  const duplicateViewName = (name) => {
    addAlert('Duplicating view....');
    const findNames = views
      .filter((item) => item.id === 'RETAIL_ENQUIRY')
      .map(({ name }) => ({ name }));
    const existingViews = [];
    for (let view of findNames) {
      existingViews.push(view.name);
    }
    const viewName = DuplicateNameGenerator(name, existingViews);
    saveView(viewName);
  };

  const deleteViewName = (view) => {
    const payload = {
      id: 'RETAIL_ENQUIRY',
      name: view
    };
    removeUserView(payload)
      .then((res) => {
        if (res.status === 200) {
          addAlert(`Removed view`, 'success');
          if (headerName === view) {
            applyNewView(defaultViewName);
          }
          setRefreshViews(true);
        }
      })
      .catch((err) => {
        addAlert(err.response?.data?.errorMessages[0].message, 'error');
      });
  };

  const handleSave = () => {
    setNewDetailObject({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      colState: gridOptions.columnApi.getColumnState(),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      filterState: gridOptions.api.getFilterModel()
    });
    setReadyToSave(true);
  };

  const addNewView = () => {
    const findNames = views
      .filter((item) => item.id === 'RETAIL_ENQUIRY')
      .map(({ name }) => ({ name }));
    const existingViews = [];
    for (let view of findNames) {
      existingViews.push(view.name);
    }
    const newViewName = NameGenerator('View', existingViews);
    const payload = {
      id: 'RETAIL_ENQUIRY',
      name: newViewName,
      shareable: false
    };
    addAlert(`Creating ${newViewName}`);
    commonActions(payload)
      .then((response) => {
        if (response.status === 201) {
          setRefreshViews(true);
          addAlert(`${newViewName} created succesfully`, 'success');
        }
      })
      .catch((err) => {
        if (err.response?.data?.errorMessages) {
          addAlert(err.response?.data?.errorMessages[0].message, 'error');
        } else {
          addAlert('Unexpected Error occurred while processing your request', 'error');
        }
        setRefreshViews(true);
      });
  };

  const makeItAsDefault = (name, status) => {
    //Api call to set default if it is not already default
    if (!status) {
      addAlert('updating default view');
      const payload = { id: 'RETAIL_ENQUIRY', name };
      makeItDefault(payload)
        .then((response) => {
          if (response.status === 200) {
            setRefreshViews(true);
            setDefaultViewName(name);
            addAlert(`${name} Updated as default succesfully`, 'success');
          }
        })
        .catch((err) => {
          if (err.response?.data?.errorMessages) {
            addAlert(err.response?.data?.errorMessages[0].message, 'error');
          } else {
            addAlert('Unexpected Error occurred while processing your request', 'error');
          }
        });
    }
  };

  const findTheSelectedView = (array, nameToSearch) => {
    return array.filter((item) => {
      if (item.id === 'RETAIL_ENQUIRY' && item.name === nameToSearch) {
        return item;
      }
    });
  };

  const handleReplace = () => {
    renameView(oldName, replaceName);
  };

  const renameView = (view, newview) => {
    const payload = {
      id: 'RETAIL_ENQUIRY',
      name: view,
      newName: newview
    };
    renameUserView(payload)
      .then((res) => {
        if (res.status === 200) {
          setRefreshViews(true);
          addAlert(`${newview} saved`, 'success');
          //  applyNewView(newview);
        }
      })
      .catch((err) => {
        if (err.response?.data?.errorMessages) {
          addAlert(err.response?.data?.errorMessages[0].message, 'error');
        } else {
          addAlert('Unexpected Error occurred while processing your request', 'error');
        }
      });
    setOpen(false);
  };

  useEffect(() => {
    if (readyToSave) {
      if (JSON.stringify(oldViewState1) !== JSON.stringify(newDetailObject)) {
        const payload = {
          id: 'RETAIL_ENQUIRY',
          name: activeName,
          shareable: false,
          detail: {
            // if column autosize then make width property as null
            // kabab on autosize make deault width pixel
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            colState: gridOptions.columnApi.getColumnState(),
            // colState: gridOptions.columnApi.getColumnState().map((item) => {
            //   if (columnData.includes(item.colId)) {
            //     return Object.assign({ ...item, width: null });
            //   } else if (item.colId.toLowerCase() === 'kabab') {
            //     return Object.assign({ ...item, width: 56 });
            //   }
            //   return item;
            // }),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            filterState: gridOptions.api.getFilterModel()
          }
        };
        commonActions(payload)
          .then((response) => {
            if (response.status === 201) {
              setRefreshViews(true);
              setOpen(false);
              addAlert(`${activeName} updated succesfully`, 'success');
              dispatch(setNavAlert(false));
              dispatch(setCompetitorsRetails(false));
            }
          })
          .catch((err) => {
            if (err.response?.data?.errorMessages) {
              addAlert(err.response?.data?.errorMessages[0].message, 'error');
            } else {
              addAlert('Unexpected Error occurred while processing your request', 'error');
            }
            setOpen(false);
          });
      }
      setReadyToSave(false);
    }
  }, [readyToSave]);

  useEffect(() => {
    if (switchView) {
      const newViewState = findTheSelectedView(views, newViewName);
      const newViewItem = Object.assign({}, ...newViewState);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      gridOptions.columnApi.setColumnState(newViewItem.detail?.colState);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      gridOptions.api.setFilterModel(newViewItem.detail?.filterState);

      // autosize columns
      // autoSizeAll([newViewItem]);
      setNewViewName(newViewName);
      setActiveName(newViewName);
      setSelectedClass(newViewName.replace(/ /g, ''));
      setHeaderName(newViewName);
      setSwitchView(false);
      setApplyViewClicked(false);
      setUpdateClickView(false);
      setDisableSaveBtn(true);
      dispatch(setSelectedView(newViewItem.detail));
      setViewUpdated(true);
    }
  }, [switchView]);

  useEffect(() => {
    if (applyViewClicked) {
      if (_.isEqual(oldViewState1, detailObject)) {
        setSwitchView(true);
      } else {
        setOpen(true);
        setModalProps({
          title: 'Save table',
          firstButton: `No, don't save`,
          secondButton: 'Yes, save',
          content: `${NAV_ALERT_MESSAGE_VIEWS} ${activeName}`
        });

        if (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          oldViewState1.colState.length != detailObject.colState.length &&
          isSelectedView.competitorsRetails
        ) {
          setModalProps({
            title: 'Save table',
            firstButton: `No, don't save`,
            secondButton: 'Yes, save',
            content: `${COMPETITOR_VIEWS_MESSAGE}`
          });
        }
      }
      setApplyViewClicked(false);
      setUpdateClickView(true);
    }
  }, [applyViewClicked]);

  useEffect(() => {
    if (replaceName) {
      setModalProps({
        title: `This table already exists`,
        firstButton: `No, don't save`,
        secondButton: 'Yes, replace',
        content: `Replace ${replaceName} ?`
      });
      setApplyViewClicked(false);
      setUpdateClickView(false);
    }
  }, [replaceName]);

  const applyView = (name) => {
    setDetailObject({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      filterState: gridOptions.api.getFilterModel(),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      colState: gridOptions.columnApi.getColumnState()
    });
    setNewViewName(name);
    const oldViewState = findTheSelectedView(views, activeName);
    setOldViewState1(oldViewState[0].detail);
    setApplyViewClicked(true);
  };

  const applyNewView = (name) => {
    setHeaderName(name);
    setSelectedClass(name.replace(/ /g, ''));
    const newViewState = findTheSelectedView(views, name);
    const newViewItem = Object.assign({}, ...newViewState);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    gridOptions.columnApi.setColumnState(newViewItem.detail?.colState);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    gridOptions.api.setFilterModel(newViewItem.detail?.filterState);
    setNewViewName(name);
    setSwitchView(true);
    setReplaceName('');
  };

  const handleDialogCancel = () => {
    setOpen(false);
  };

  const handleFirstButtonClick = () => {
    setOpen(false);
    setSwitchView(true);
  };

  const handleSecondButtonClick = () => {
    if (JSON.stringify(detailObject) !== JSON.stringify(newDetailObject)) {
      setReadyToSave(true);
    }
  };

  const ListItem = ({ view }) => {
    const [editViewItem, setEditViewItem] = useState(false);

    useEffect(() => {
      if (view.active) setDefaultViewName(view.name);
    });

    const onValueChange = (e, name) => {
      const value = e.target.value;
      if (e.key === 'Enter' || e.type === 'blur') {
        if (value != name) {
          const findNames = views
            .filter((item) => item.id === 'RETAIL_ENQUIRY')
            .map(({ name }) => ({ name }));
          const existingViews = [];
          for (let view of findNames) {
            existingViews.push(view.name);
          }
          if (duplicateChecker(value, existingViews)) {
            setReplaceName(value);
            setOldName(name);
            setOpen(true);
          } else {
            addAlert('Renaming a view');
            renameView(name, value);
            setReplaceName(value);
          }
        }
      }
    };

    return (
      <div
        className={
          selectedClass === view.name.replace(/ /g, '') ? 'viewListItem Active' : 'viewListItem'
        }
      >
        <Tooltip title={view.active ? 'Default' : 'Save as default'} data-testid="icon1">
          <span className={'favouriteIcon'}>
            {view.active === true ? (
              <FavouriteSelected />
            ) : (
              <Favourite
                data-testid={'make-it-default'}
                onClick={() => makeItAsDefault(view.name, view.active)}
              />
            )}
          </span>
        </Tooltip>
        {editViewItem ? (
          <input
            type={'text'}
            className={'addViewInput'}
            defaultValue={view.name}
            onBlur={(e) => onValueChange(e, view.name)}
            onChange={(e) => onValueChange(e, view.name)}
            onKeyDown={(e) => onValueChange(e, view.name)}
          />
        ) : (
          <span className={'viewName'} title={view.name} onClick={() => applyView(view.name)}>
            {view.name}
          </span>
        )}
        <span className={'kebabMenu'}>
          <KababMenu>
            <Tooltip title={'Duplicate'} data-testid="icon">
              <span className={styles.icons}>
                <Duplicate
                  className={styles.kebabIcon}
                  onClick={() => duplicateViewName(view.name)}
                />
              </span>
            </Tooltip>
            {!defaultView && (
              <Tooltip title={'Edit'} data-testid={view.id}>
                <span className={styles.icons}>
                  <EditIcon
                    data-testid={'edit-icon'}
                    className={styles.kebabIcon}
                    onClick={() => {
                      setEditViewItem(!editViewItem);
                    }}
                  />
                </span>
              </Tooltip>
            )}

            {!view.active && !defaultView && (
              <Tooltip title={'Remove'} data-testid={view.id}>
                <span className={styles.icons}>
                  <DeleteIcon
                    className={styles.kebabIcon}
                    onClick={() => deleteViewName(view.name)}
                  />
                </span>
              </Tooltip>
            )}
          </KababMenu>
        </span>
      </div>
    );
  };

  return (
    <Can
      perform={staticPermission.NEW_RETAIL_PATH}
      permission={USER_ACTIONS.VIEW}
      yes={() => (
        <>
          <CustomViewWrapper>
            {isSelectedView.viewsApiError ? (
              <div className={'errorMsg'}>There is an error while fetching the data.</div>
            ) : (
              <>
                <section className={'viewHeader'}>
                  <span className={'listViewIcon'}>
                    <ListViewIcon />
                  </span>
                  <span> {headerName}</span>
                  <span className={'addBtn'}>
                    <Tooltip title={'Add View'} data-testid="icon">
                      <AddIcon onClick={addNewView} />
                    </Tooltip>
                  </span>
                </section>
                <section className={'viewBody'}>
                  {views.map((view) => {
                    return <ListItem view={view} key={view.name.replace(/ /g, '')} />;
                  })}
                </section>
                <section className={'viewFooter'}>
                  <CustomButton
                    type="secondary"
                    variant="outlined"
                    disabled={disableSaveBtn}
                    onClick={handleSave}
                  >
                    <span className={'saveTxt'}>Save</span>
                  </CustomButton>
                </section>
              </>
            )}
          </CustomViewWrapper>
          <DialogBox
            isOpen={open}
            handleClose={handleDialogCancel}
            title={modalProps.title}
            contentField={modalProps.content}
            firstButtonText={modalProps.firstButton}
            handleFirstButtonClick={updatedClickView ? handleFirstButtonClick : handleDialogCancel} // handleClose
            secondButtonText={modalProps.secondButton}
            handleSecondButtonClick={updatedClickView ? handleSecondButtonClick : handleReplace} //handleReplace
            disabledFirstButton={false}
            disabledSecondButton={false}
          />
        </>
      )}
      no={() => <NoAccess />}
    />
  );
};

export default CustomViewPanel;

const CustomViewWrapper = styled('div')`
  display: flex;
  flex: 1 100%;
  flex-direction: column;
  height: 100%;
  margin: 0;
  position: relative;
  width: 250px;
  overflow: hidden;
  .errorMsg {
    padding: 50px 10px;
  }
  .viewHeader {
    height: 49px;
    display: flex;
    padding: 15px 10px;
    font-size: 13px;
    color: #0071e9;
    font-weight: bold;
    background: #f1f1f1;
    border-bottom: 1px solid #f8f8f8;
    .listViewIcon {
      padding-right: 10px;
    }
    .addBtn {
      align-items: flex-end;
      display: flex;
      margin-left: auto;
      cursor: pointer;
    }
  }
  .viewBody {
    height: calc(100vh - 370px);
    display: block;
    overflow-y: auto;
    .viewListItem {
      padding: 10px;
      display: flex;
      height: 40;
      position: relative;
      .favouriteIcon {
        padding: 0;
        margin-top: 0px;
        padding-right: 4px;
        cursor: pointer;
      }
      .viewName {
        padding-top: 5px;
        cursor: pointer;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .favouriteTxt {
        padding-top: 5px;
      }
      .kebabMenu {
        margin-left: auto;
        top: 5px;
        right: 10px;
        position: absolute;
      }
      &.Active {
        background: #e9f5ff;
      }
    }
    .addViewInput {
      padding: 6px;
      border: 1px solid #ccc;
      box-shadow: none;
      outline: none;
      width: 175px;
      &:focus,
      &:focus-visible {
        border: 1px solid #0071e9;
      }
    }
  }

  .viewFooter {
    position: absolute;
    bottom: 0;
    width: 240px;
    margin: 10px;
    button {
      width: 230px;
    }
  }
`;
