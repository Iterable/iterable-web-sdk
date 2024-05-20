import { IterableEmbeddedDefaultAction } from 'src/embedded';

export const defaultNotificationStyles = (
  defaultAction?: IterableEmbeddedDefaultAction
) => `
  background: white;
  border-radius: 10px;
  padding: 20px;
  border: 3px solid #caccd1;
  margin-bottom: 10px;
  cursor: ${defaultAction ? 'pointer' : 'auto'};  
  
  @media screen and (max-width: 800px) {
    display: flex;
    flex-direction: column;
  }
`;

export const defaultTitleStyles = `
  margin-top: 0px;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 4px;
  color: rgb(61, 58, 59);
  display: block;

  @media screen and (max-width: 800px) {
    line-height: 1.3em;
    display: flex;
    flex-direction: column;
  }
`;

export const defaultBodyStyles = `
  margin-top: 0.2em;
  font-size: 17px;
  margin-bottom: 10px;
  display: block;
  color: rgb(120, 113, 116);

  @media screen and (max-width: 800px) {
    line-height: 1.3em;
    display: flex;
    flex-direction: column;
  }
`;

export const defaultButtonsDiv = `
  margin-top: auto;

  @media screen and (max-width: 800px) {
    display: flex;
    flex-direction: column;
  }
`;

export const defaultTextParentStyles = `
  overflow-wrap: break-word;

  @media screen and (max-width: 800px) {
    display: flex;
    flex-direction: column;
  }
`;

export const defaultButtonStyles = `
  max-width: calc(50% - 32px); 
  text-align: center; 
  font-weight: bold;
  border-radius: 100px;
  padding: 8px 0px;
  margin-right: 12px; 
  cursor: pointer; 
  border: none; 
  font-size: 16px;
  color: #622a6a;
  background: none;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const notificationButtons = `
  margin-top: auto;
  display:flex;
  flex-direction:row;
  flex-wrap: wrap;
  row-gap: 0.3em;
`;

export const defaultPrimaryButtonStyle = `
  background: #622a6a; 
  color: white; 
  padding: 8px 12px;
`;

export const mediaStyle = `
  @media screen and (max-width: 800px) {
    .titleText {
      line-height: 1.3em;
    }
    .notification {
      display: flex;
      flex-direction: column;
    }
  }
`;
