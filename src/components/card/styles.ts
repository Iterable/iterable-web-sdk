import { IterableEmbeddedDefaultAction } from 'src/embedded';

export const defaultCardStyles = (
  defaultAction?: IterableEmbeddedDefaultAction
) => `border: 1px solid #ccc;
border-radius: 8px;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
margin: auto;
margin-top: 10px;
margin-bottom: 10px;
padding-bottom: 10px;
cursor: ${defaultAction ? 'pointer' : 'auto'};
`;
export const defaultImageStyles = `
  width: 100%;
  aspect-ratio: 16/9;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  object-fit: cover;

  @media screen and (max-width: 800px) {
    display: flex;
    flex-direction: column;
  }
`;
export const defaultTitleStyles = `
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 9px;
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
  color: rgb(120, 113, 116);

  @media screen and (max-width: 800px) {
    line-heißght: 1.3em;
  }
`;
export const defaultButtonStyles = `
  max-width: calc(50% - 32px);
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  background-color: transparent;
  color: #622a6a;
  border: none;
  border-radius: 0;
  cursor: pointer;
  padding: 5px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const defaultTextParentStyles = `
  overflow-wrap: break-word;
  margin: 10px;
`;

export const cardButtons = `
  margin-top: auto;
  margin-left: 5px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
