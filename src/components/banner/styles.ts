import { IterableEmbeddedDefaultAction } from '../../embedded';

export const defaultBannerStyles = (
  defaultAction?: IterableEmbeddedDefaultAction
) => `
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: auto;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px 20px 15px 20px;
  cursor: ${defaultAction ? 'pointer' : 'auto'};

  @media screen and (max-width: 800px) {
    display: flex;
    flex-direction: column;
    min-width: fit-content;
  }
`;

export const defaultImageStyles = `
  width: 70px;
  height: 70px;
  border-radius: 8px;
  margin-left: 10px;
  object-fit: cover;
  margin-top: 5px;
`;

export const defaultTitleStyles = `
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
  color: rgb(61, 58, 59);
  display: block;

  @media screen and (max-width: 800px) {
    line-height: 1.3em;
  }
`;

export const defaultBodyStyles = `
  font-size: 17px;
  margin-bottom: 10px;
  display: block;
  margin-bottom: 25px;
  color: rgb(120, 113, 116);

  @media screen and (max-width: 800px) {
    line-height: 1.3em;
  }
`;

export const bannerButtons = `
  margin-top: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  row-gap: 0.2em;
`;

export const defaultButtonStyles = `
  max-width: calc(50% - 32px);
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 100px;
  cursor: pointer;
  padding: 8px 0px;
  margin-right: 12px;
  color: #622a6a;
  background: none;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const defaultPrimaryButtonStyle = `
  background: #622a6a;
  color: white; 
  padding: 8px 12px;
`;

export const defaultTextParentStyles = `
  flex: 1;
  max-width: calc(100% - 80px);
  overflow-wrap: break-word;
`;

export const textTitleImageDefaultStyle = `
  display: flex;
  flex-direction: row;
`;
