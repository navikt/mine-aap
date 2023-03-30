import * as style from 'components/FlexContainer/VerticalFlexContainer.module.css';

interface Props {
  children: React.ReactNode;
}

export const VerticalFlexContainer = ({ children }: Props) => <div className={style.container}>{children}</div>;
