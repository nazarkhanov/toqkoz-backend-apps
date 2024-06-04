import * as uikit from "@/shared/uikit";
import * as consts from "@/shared/constants";

const LABEL_CONST = consts.LABEL_CONST;

const STATUS_CONST = {
	ENABLED: "success",
	DISABLED: "error",
	TRIAL: "warning",
};

function Badge({ status }) {
	return (
		<uikit.Badge
			view="stroked"
			size="s"
			label={LABEL_CONST[status] || LABEL_CONST.DISABLED}
			status={STATUS_CONST[status] || STATUS_CONST.DISABLED}
		/>
	);
}

export { Badge };
