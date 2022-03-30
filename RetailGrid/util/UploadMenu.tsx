import style from '../retailGrid.module.css';
import { FC } from 'react';

interface IUploadMenu {
  popList: boolean;
  uploadTypes: any;
  handleUploadOpen(title: string): void;
}

export const UploadMenu: FC<IUploadMenu> = ({ popList, uploadTypes, handleUploadOpen }) => {
  return popList && uploadTypes?.length > 1 ? (
    <div data-testid="upload-menu-container" className={style.uploadMenu}>
      {uploadTypes.map((v) => (
        <p
          data-testid={'upload-menu-item-' + v.title}
          className={v.disable ? style.disabledProperty : style.uploadMenuItem}
          key={v.title}
          onClick={() => handleUploadOpen(v.title)}
        >
          {v.value}
        </p>
      ))}
    </div>
  ) : null;
};
