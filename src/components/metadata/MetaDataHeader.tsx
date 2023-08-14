import cx from "classnames";
import { CaretDown, CaretUp } from "phosphor-react";
import { useHeaderContext } from "../../contexts";
import { getTheme } from "../../themes/getTheme";
import { UserRole } from "../../types";
import { Button } from "../Button";

interface MetaDataProps {
  owner: UserRole;
  isBodyOpen: boolean;
  setIsBodyOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MetaDataHeader: React.FC<MetaDataProps> = ({
  owner,
  isBodyOpen,
  setIsBodyOpen,
}) => {
  const { selectedTheme } = useHeaderContext();
  const isPlaintiff = owner === UserRole.Plaintiff;

  const toggleMetaData = () => {
    setIsBodyOpen(!isBodyOpen);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex gap-2">
        <Button
          position="end"
          bgColor={cx({
            [`bg-${getTheme(selectedTheme)?.secondaryPlaintiff} hover-bg-${
              getTheme(selectedTheme)?.primaryPlaintiff
            }`]: isPlaintiff,
            [`bg-${getTheme(selectedTheme)?.secondaryDefendant} hover-bg-${
              getTheme(selectedTheme)?.primaryDefendant
            }`]: !isPlaintiff,
          })}
          textColor={cx("font-bold text-sm uppercase tracking-wider", {
            [`text-${getTheme(selectedTheme)?.primaryPlaintiff} hover-text-${
              getTheme(selectedTheme)?.secondaryPlaintiff
            }`]: isPlaintiff,
            [`text-${getTheme(selectedTheme)?.primaryDefendant} hover-text-${
              getTheme(selectedTheme)?.secondaryDefendant
            }`]: !isPlaintiff,
          })}
          size="sm"
          onClick={toggleMetaData}
          icon={
            isBodyOpen ? (
              <CaretUp size={14} weight="bold" />
            ) : (
              <CaretDown size={14} weight="bold" />
            )
          }>
          {owner}
        </Button>
      </div>
    </div>
  );
};
