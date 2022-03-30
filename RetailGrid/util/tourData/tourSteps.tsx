import { StepType } from '@reactour/tour';
import styles from './tour.module.css';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { handleAddStyling, removeInlineStyling } from '@utils/reactourUtils/helperFunctions';

export const steps: StepType[] = [
  /* Step 1 of retail grid tour */
  {
    selector: '.MuiAutocomplete-root',
    content: (
      <p className={styles.tourContent}>
        To access current retail data, we’ll start by searching for cucumbers, item number #217934.
      </p>
    ),
    action: (node: any) => {
      handleAddStyling(styles.nodeBorder, [node], { styleAdded: 'nodeBorder' });
      node.style.borderRadius = '9px';
    }
  },
  /* Step 2 of retail grid tour */
  {
    selector: '.MuiAutocomplete-popper',
    content: (
      <p className={styles.tourContent}>Items matching the item number shows up in the list</p>
    ),
    action: () => {
      setTimeout(() => {
        const selectedNode = document.getElementsByClassName('MuiAutocomplete-paper')[0];
        selectedNode.innerHTML =
          // eslint-disable-next-line max-len
          '<ul class="MuiAutocomplete-listbox" role="listbox" id="tags-outlined-popup" aria-labelledby="tags-outlined-label"><li tabindex="-1" role="option" id="tags-outlined-option-0" data-option-index="0" aria-disabled="false" aria-selected="false" class="MuiAutocomplete-option" data-focus="true">Apple iPad (2018 Model) Wifi 128 GB - Space gray</li><li tabindex="-1" role="option" id="tags-outlined-option-1" data-option-index="1" aria-disabled="false" aria-selected="false" class="MuiAutocomplete-option">Apple iPad (2018 Model) WiFi 128 GB - Gold</li></ul>';
      }, 0);
    },
    highlightedSelectors: ['.MuiAutocomplete-popper', '.MuiAutocomplete-root'],
    position: 'bottom',
    resizeObservables: ['.MuiAutocomplete-popper', '.MuiAutocomplete-root']
  },
  /* Step 3 of retail grid tour */
  {
    selector: '.ag-column-select-list',
    content: (
      <div className={styles.tourContainer}>
        <p className={styles.tourHeader}>Make your data relevant</p>
        <p className={styles.tourContent}>
          Now you have access to all of the retail information for this item. Customize your table
          by toggling columns you want to see on and off.
        </p>
      </div>
    ),
    position: 'left',
    action: (element) => {
      // handleRemoveStyling();
      const node: any = document.getElementsByClassName('ag-selected');
      if (
        node?.length &&
        node[0].getElementsByClassName('ag-side-button-label')[0]?.innerText?.toLowerCase() !==
          'columns'
      ) {
        const el: any = document.getElementsByClassName('ag-side-button')[0]?.children[0];
        if (el) el.click();
      }
      handleAddStyling(styles.nodeBorder, [element], { styleAdded: 'nodeBorder' });
    },
    resizeObservables: ['.ag-column-select-list'],
    mutationObservables: ['.ag-column-select-list']
  },
  /* Step 4 of retail grid tour */
  {
    selector: '.ag-column-panel > .ag-unselectable',
    content: (
      <div className={styles.tourContainer}>
        <p className={styles.tourHeader}>Visualize your data</p>
        <p className={styles.tourContent}>
          Drag and dropping columns here to group your data. You can group by as many columns as
          needed.
        </p>
      </div>
    ),
    position: 'left',
    highlightedSelectors: ['.ag-column-panel > .ag-unselectable', '.disableItem'],
    mutationObservables: ['.ag-column-panel > .ag-unselectable', '.disableItem'],
    action: () => {
      // handleRemoveStyling();
      const nodeEl: any = document.getElementsByClassName('ag-selected');
      if (
        nodeEl?.length &&
        nodeEl[0].getElementsByClassName('ag-side-button-label')[0]?.innerText?.toLowerCase() !==
          'columns'
      ) {
        const el: any = document.getElementsByClassName('ag-side-button')[0]?.children[0];
        if (el) el.click();
      }
      setTimeout(() => {
        const destinationNode = document.getElementsByClassName('ag-column-drop-vertical-list')[0];
        destinationNode.innerHTML =
          // eslint-disable-next-line max-len
          '<span class="ag-column-drop-cell ag-column-drop-vertical-cell"><span ref="eDragHandle" class="ag-drag-handle ag-column-drop-cell-drag-handle ag-column-drop-vertical-cell-drag-handle"><span class="ag-icon ag-icon-grip" unselectable="on" role="presentation"></span></span><span ref="eText" class="ag-column-drop-cell-text ag-column-drop-vertical-cell-				text">Item number</span><span ref="eButton" class="ag-column-drop-cell-button ag-column-drop-vertical-cell-button"><span class="ag-icon ag-icon-cancel" unselectable="on" role="presentation"></span></span></span><span class="ag-column-drop-cell ag-column-drop-vertical-cell"><span ref="eDragHandle" class="ag-drag-handle ag-column-drop-cell-drag-handle ag-column-drop-vertical-cell-drag-handle"><span class="ag-icon ag-icon-grip" unselectable="on" role="presentation"></span></span><span ref="eText" class="ag-column-drop-cell-text ag-column-drop-vertical-cell-				text">Retail</span><span ref="eButton" class="ag-column-drop-cell-button ag-column-drop-vertical-cell-button"><span class="ag-icon ag-icon-cancel" unselectable="on" role="presentation"></span></span></span>';
        const element: any = document.getElementsByClassName('ag-drag-handle')[0];
        const node: any = document.getElementsByClassName('ag-column-drop-vertical')[0];
        handleAddStyling(styles.nodeBorder, [element, node], { styleAdded: 'nodeBorder' });
        node.style.borderBottom = '2px solid #CD179B';
        element.style.borderRadius = '4px';
      }, 0);
    }
  },
  /* Step 5 of retail grid tour */
  {
    selector: '.ag-column-drop-empty.ag-last-column-drop',
    content: (
      <div className={styles.tourContainer}>
        <p className={styles.tourHeader}>Aggregate your data</p>
        <p className={styles.tourContent}>
          When your data is grouped, drag numeric columns here to display aggregated data values in
          your table like averages, sum, min, max. View all aggregation options in the
          <b> column action menu</b>.
        </p>
      </div>
    ),
    position: 'bottom',
    highlightedSelectors: ['.ag-column-drop-empty.ag-last-column-drop', '.ag-drag-handle'],
    resizeObservables: ['.ag-column-drop-empty.ag-last-column-drop', '.ag-drag-handle'],
    mutationObservables: ['.ag-column-drop-empty.ag-last-column-drop', '.ag-drag-handle'],
    action: (node: any) => {
      if (node) {
        const nodeEl: any = document.getElementsByClassName('ag-selected');
        if (
          nodeEl?.length &&
          nodeEl[0].getElementsByClassName('ag-side-button-label')[0]?.innerText?.toLowerCase() !==
            'columns'
        ) {
          const el: any = document.getElementsByClassName('ag-side-button')[0]?.children[0];
          if (el) el.click();
        }
        setTimeout(() => {
          const destinationNode = node.getElementsByClassName('ag-column-drop-vertical-list')[0];
          destinationNode.innerHTML =
            // eslint-disable-next-line max-len
            '<span class="ag-column-drop-cell ag-column-drop-vertical-cell"><span ref="eDragHandle" class="ag-drag-handle ag-column-drop-cell-drag-handle ag-column-drop-vertical-cell-drag-handle"><span class="ag-icon ag-icon-grip" unselectable="on" role="presentation"></span></span><span ref="eText" class="ag-column-drop-cell-text ag-column-drop-vertical-cell-				text">sum(Club)</span><span ref="eButton" class="ag-column-drop-cell-button ag-column-drop-vertical-cell-button"><span class="ag-icon ag-icon-cancel" unselectable="on" role="presentation"></span></span></span>';
          const element = document.getElementsByClassName('ag-drag-handle')[0];

          handleAddStyling(styles.nodeBorder, [element, node], { styleAdded: 'nodeBorder' });
          node.style.borderBottom = '2px solid #CD179B';
        }, 0);
      }
    }
  },
  /* Step 6 of retail grid tour */
  {
    selector: '[col-id="itemNbr"]',
    content: (
      <div className={styles.tourContainer}>
        <p className={styles.tourHeader}>Organize your data</p>
        <p className={styles.tourContent}>
          Each column is sortable. You can also sort by multiple columns by holding down the{' '}
          <b>Ctrl key</b> (or <b>Command</b> key on Apple), while selecting additional columns.
        </p>
      </div>
    ),
    resizeObservables: ['[col-id="itemNbr"]'],
    mutationObservables: ['[col-id="itemNbr"]'],
    position: 'right',
    action: (node) => {
      if (node) {
        handleAddStyling(styles.nodeBorder, [node], { styleAdded: 'nodeBorder' });
      }
    }
  },
  /* Step 7 of retail grid tour */
  {
    selector: '[col-id="itemNbr"]',
    content: (
      <div className={styles.tourContainer}>
        <p className={styles.tourHeader}>Organize your data</p>
        <p className={styles.tourContent}>
          Each column also has options to <b>filter, sort, pin to the left</b> and <b>more</b>.
          These options can be accessed here in the <b>column action menu</b>.
        </p>
      </div>
    ),
    resizeObservables: ['[col-id="itemNbr"]'],
    mutationObservables: ['[col-id="itemNbr"]'],
    action: (node) => {
      if (node) {
        node.classList.add('ag-header-active');
        const itemSort: any = node.getElementsByClassName('ag-header-cell-menu-button')[0];
        itemSort.classList.add(styles.nodeBorder);
        handleAddStyling(styles.nodeBorder, [itemSort], { styleAdded: 'nodeBorder' });
        itemSort.style.paddingRight = '7px';
      }
    },
    position: 'right'
  },
  /* Step 8 of retail grid tour */
  {
    selector: '[col-id="itemDesc"]',
    content: (
      <div className={styles.tourContainer}>
        <p className={styles.tourHeader}>Organize your data</p>
        <p className={styles.tourContent}>
          Each column is also re-sizeable and can be re-ordered by dragging it to a new position.
        </p>
      </div>
    ),
    position: 'right',
    highlightedSelectors: ['[col-id="itemNbr"]', '[col-id="itemDesc"]'],
    resizeObservables: ['[col-id="itemNbr"]', '[col-id="itemDesc"]'],
    mutationObservables: ['[col-id="itemNbr"]', '[col-id="itemDesc"]'],
    action: () => {
      const el: any = document.getElementsByClassName('ag-header-cell-sortable');
      if (el?.length > 1) {
        for (let i = 0; i < 2; i++) {
          handleAddStyling(styles.nodeBorder, [el[i]], { styleAdded: 'nodeBorder' });
          if (i) {
            el[i].setAttribute('inlineDescStyleAdded', 'itemDesc');
            el[i].classList.add(styles.itemDesc);
          } else {
            el[i].setAttribute('inlineItemStyleAdded', 'itemNbr');
            el[i].classList.add(styles.itemNbr);
          }
        }
      }
    }
  },
  /* Step 9 of retail grid tour */
  {
    selector: '.ag-side-button.ag-selected',
    content: (
      <div className={styles.tourContainer}>
        <p className={styles.tourHeader}>Save views for later</p>
        <p className={styles.tourContent}>
          Once you have your data displayed how you’d like, click into the <b>views</b> panel to
          save and name your view for quick access later.
        </p>
      </div>
    ),
    action: (node: any) => {
      if (node) {
        if (
          node.getElementsByClassName('ag-side-button-label')[0]?.innerText?.toLowerCase() !==
          'views'
        ) {
          const buttonEl: any = document.getElementsByClassName('ag-side-button')[1].children[0];
          if (buttonEl) {
            buttonEl.click();
          }
        }
        const node1 = document.getElementsByClassName('ag-selected')[0];
        handleAddStyling(styles.nodeBorder, [node1], { styleAdded: 'nodeBorder' });
      }
    },
    mutationObservables: ['.ag-side-button.ag-selected'],
    position: 'left'
  },
  /* Step 10 of retail grid tour */
  {
    selector: '.ag-pinned-right-cols-container',
    content: (
      <div className={styles.tourContainer}>
        <p className={styles.tourHeader}>Take action</p>
        <p className={styles.tourContent}>
          For quick updates, add, edit or lock retails by accessing the row action menu.
        </p>

        <p className={styles.tourContent}>
          For bulk updates, upload retails or locks in a spreadsheet. You can also download the
          retail table at any time.
        </p>
      </div>
    ),
    position: 'left',
    highlightedSelectors: ['.ag-pinned-right-cols-container', '.new-retail div div div'],
    resizeObservables: ['.ag-pinned-right-cols-container', '.new-retail div div div'],
    mutationObservables: ['.ag-pinned-right-cols-container', '.new-retail div div div'],
    action: (node: any) => {
      if (node) {
        const buttonGrid = document.querySelectorAll('.new-retail div div div')[0];
        handleAddStyling(styles.nodeBorder, [node, buttonGrid], { styleAdded: 'nodeBorder' });
        const kebab: any = document.querySelectorAll(
          '.ag-pinned-right-cols-container > div[row-index="8"]'
        );
        if (kebab?.length) {
          kebab[0].style.borderBottom = '2px solid #CD179B';
          node.style.borderRadius = '0px';
        }
      }
    }
  },
  /* Step 11 of retail grid tour */
  {
    selector: '.headerAlign',
    content: (
      <div className={styles.tourContainer}>
        <p className={styles.tourHeader}>Want to learn more</p>
        <p className={styles.tourContent}>
          Re-visit this tour and others by clicking the Help{' '}
          <span>
            <HelpOutlineIcon style={{ fontSize: '14px' }} />
          </span>{' '}
          button in the left navigation.
        </p>
      </div>
    ),
    position: 'bottom',
    action: () => {
      removeInlineStyling([
        {
          inlineStyleElements: ['rect'],
          inlineStyle: { visibility: 'hidden' }
        }
      ]);
    }
  }
];
