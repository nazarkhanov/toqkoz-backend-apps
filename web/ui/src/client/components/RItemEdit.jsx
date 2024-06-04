import "./RItemEdit.css";

import * as React from "react";
import * as ReactRouter from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import * as utils from "@/shared/utils";
import * as uikit from "@/shared/uikit";
import * as consts from "@/shared/constants";
import * as organizations from "@/external/organizations";
import * as facilities from "@/external/facilities";
import * as trackers from "@/external/trackers";
import * as users from "@/external/users";

const cn = utils.useClassName("Cabinet-ItemEdit");

const FORM_STATES_CONST = {
	DEFAULT: "default",
	LOADING: "loading",
	LOADED: "loaded",
};

function ItemEdit() {
	const organization = ReactRouter.useOutletContext();
	const update = organizations.useUpdate({ id: organization.id });

	const [formState, setFormState] = React.useState(FORM_STATES_CONST.DEFAULT);

	const handleSubmit = async (data) => {
		if (formState !== FORM_STATES_CONST.DEFAULT) return;

		setFormState(FORM_STATES_CONST.LOADING);

		await update.mutateAsync(data);

		setFormState(FORM_STATES_CONST.LOADED);

		setTimeout(() => {
			setFormState(FORM_STATES_CONST.DEFAULT);
		}, 1000);
	};

	return (
		<div className={cn()}>
			<Formik
				initialValues={{
					name: organization?.name || "",
					status: organization?.status || "",
				}}
				validationSchema={Yup.object({
					name: Yup.string().trim().required("Это обязательное поле"),
					status: Yup.mixed()
						.oneOf(Object.keys(consts.LABEL_CONST))
						.required("Это обязательное поле"),
				})}
				onSubmit={handleSubmit}
			>
				{(form) => (
					<form className={cn("Form")} onSubmit={form.handleSubmit}>
						<TextField
							className={cn("TextField")}
							placeholder="Без названия"
							label="Название организации"
							name="name"
							type="text"
							form={form}
							width="full"
						/>

						<Select
							className={cn("Select")}
							placeholder="Черновик"
							label="Статус организации"
							name="status"
							type="text"
							form={form}
							width="full"
						/>

						<div className={cn("Actions")}>
							<uikit.Button
								className={cn("Button")}
								label={
									{
										[FORM_STATES_CONST.LOADED]: "Сохранено",
										[FORM_STATES_CONST.LOADING]: "Сохраняется",
									}?.[formState] || "Сохранить"
								}
								size="l"
								type="submit"
								disabled={formState !== FORM_STATES_CONST.DEFAULT}
							/>
						</div>

						<FacilitiesTable organization={organization} />

						<TrackersTable organization={organization} />

						<UsersTable organization={organization} />
					</form>
				)}
			</Formik>
		</div>
	);
}

function TextField({ form, ...props }) {
	return (
		<uikit.TextField
			id={props.name}
			size="m"
			labelPosition="top"
			status={form.errors[props.name] && form.touched[props.name] && "alert"}
			caption={
				form.errors[props.name] &&
				form.touched[props.name] &&
				form.errors[props.name]
			}
			value={form.values[props.name]}
			onChange={(v) => form.handleChange(v.e)}
			onBlur={(v) => form.handleBlur(v)}
			{...props}
		/>
	);
}

const STATUS_ITEMS = Object.keys(consts.LABEL_CONST).map(status => ({
	'label': consts.LABEL_CONST[status],
	'value': status
}));

function Select({ form, ...props }) {
	const ref = React.useRef(null);

	return (
		<uikit.Select
			id={props.name}
			size="m"
			labelPosition="top"
			status={form.errors[props.name] && form.touched[props.name] && "alert"}
			caption={
				form.errors[props.name] &&
				form.touched[props.name] &&
				form.errors[props.name]
			}
			items={STATUS_ITEMS}
			value={STATUS_ITEMS.find(
				(item) => item.value === form.values[props.name]
			)}
			onChange={(v) => form.setFieldValue(props.name, v.value.value)}
			onBlur={(v) => form.handleBlur(v)}
			getItemKey={(item) => item.label}
			getItemLabel={(item) => item.label}
			ref={ref}
			{...props}
		/>
	);
}

const MODAL_STATES_CONST = {
	CREATE: "create",
	UPDATE: "update",
	DELETE: "delete",
};

function FacilitiesTable({ organization }) {
	const { isSmart } = utils.useMediaQuery();

	const list = facilities.useList({ organization_id: organization.id });
	const createOne = facilities.useCreate({ organization_id: organization.id });
	const updateOne = facilities.useUpdate({ organization_id: organization.id });
	const deleteOne = facilities.useDelete({ organization_id: organization.id });

	const info = {
		"title": {
			title: "Название",
			accessor: "title",
			type: "input",
		},
		"description": {
			title: "Описание",
			accessor: "description",
			type: "input",
		},
		"country": {
			title: "Страна",
			accessor: "country",
			type: "input",
		},
		"city": {
			title: "Город",
			accessor: "city",
			type: "input",
		},
		"street": {
			title: "Улица",
			accessor: "street",
			type: "input",
		},
		"number": {
			title: "Номер",
			accessor: "number",
			type: "input",
		},
		"longitude": {
			title: "Широта",
			accessor: "longitude",
			type: "number",
		},
		"latitude": {
			title: "Долгота",
			accessor: "latitude",
			type: "number",
		},
		"id": {
			title: "Идентификатор",
			accessor: "id",
			type: "text",
		},
	};

	const cols = [
		info["title"],
		info["city"],
		info["street"],
		info["id"],
	];

	const fields = [
		info["title"],
		info["description"],
		info["country"],
		info["city"],
		info["street"],
		info["number"],
		info["longitude"],
		info["latitude"],
	];

	const rows = list.data || [];

	const [isModalOpen, setIsModalOpen] = React.useState(false);
	const [modalState, setModalState] = React.useState(null);

	const handleOpen = (action) => {
		setModalState(action);
		setIsModalOpen(true);
	};

	const handleClose = () => {
		setIsModalOpen(false);
	};

	const [formState, setFormState] = React.useState(FORM_STATES_CONST.DEFAULT);
	const [facilityData, setFacilityData] = React.useState(null);

	const handleSubmit = async (data) => {
		if (formState !== FORM_STATES_CONST.DEFAULT) return;

		setFormState(FORM_STATES_CONST.LOADING);

		switch (modalState) {
			case MODAL_STATES_CONST.CREATE:
				await createOne.mutateAsync({ data });
				break;
			case MODAL_STATES_CONST.UPDATE:
				await updateOne.mutateAsync({ facility_id: facilityData.id, data });
				break;
			case MODAL_STATES_CONST.DELETE:
				await deleteOne.mutateAsync({ facility_id: facilityData.id, data });
				break;

			default:
				break;
		}

		setFormState(FORM_STATES_CONST.LOADED);

		setTimeout(() => {
			setFormState(FORM_STATES_CONST.DEFAULT);
			handleClose();
		}, 320);
	};

	cols.push({
		type: "toolbar",
		title: "Действия",
		accessor: "actions",
		renderCell: (row) => {
			return (
				<>
					<ActionButton
						className={cn("Button-One")}
						size="xs"
						text="Редактировать"
						icon={uikit.Icons.Edit}
						onClick={() =>
							setFacilityData(row) | handleOpen(MODAL_STATES_CONST.UPDATE)
						}
					/>

					<ActionButton
						className={cn("Button-One")}
						size="xs"
						text="Удалить"
						icon={uikit.Icons.Trash}
						onClick={() =>
							setFacilityData(row) | handleOpen(MODAL_STATES_CONST.DELETE)
						}
					/>
				</>
			);
		},
	});

	const maxDigits = (value, { maxDigits, decimalPlaces }) => {
		if (typeof value !== 'number') return false;
		const regex = new RegExp(`^-?\\d{1,${maxDigits - decimalPlaces}}(\\.\\d{1,${decimalPlaces}})?$`);
		return regex.test(value.toString());
	};
	  

	return (
		<div className={cn("Group")}>
			<uikit.Text className={cn("Group-Title")} view="secondary">
				Объекты организации
			</uikit.Text>
			<uikit.Table
				className={cn("Table")}
				columns={cols}
				rows={rows}
				borderBetweenColumns
				borderBetweenRows
			/>
			<ActionButton
				className={cn("Button-Add")}
				icon={uikit.Icons.Add}
				text="Добавить"
				onClick={() =>
					setFacilityData(null) | handleOpen(MODAL_STATES_CONST.CREATE)
				}
			/>
			<uikit.Modal
				className="Modal-Portal"
				hasOverlay
				isOpen={isModalOpen}
				onClickOutside={() => handleClose()}
				onEsc={() => handleClose()}
				style={{ maxWidth: isSmart ? "640px" : "90%" }}
			>
				<Formik
					initialValues={{
						title: facilityData?.title || "",
						description: facilityData?.description || "",
						country: facilityData?.country || "",
						city: facilityData?.city || "",
						street: facilityData?.street || "",
						number: facilityData?.number || "",
						longitude: facilityData?.longitude || "",
						latitude: facilityData?.latitude || "",
					}}
					validationSchema={Yup.object({
						title: Yup.string().trim().required("Это обязательное поле"),
						description: Yup.string().trim(),
						country: Yup.string().trim().required("Это обязательное поле"),
						city: Yup.string().trim().required("Это обязательное поле"),
						street: Yup.string().trim().required("Это обязательное поле"),
						number: Yup.string().trim().required("Это обязательное поле"),
						latitude:
							Yup.number().required("Это обязательное поле").min(-90, 'Широта должна быть между -90 и 90.')
								.max(90, 'Latitude must be between -90 and 90')
								.test('is-valid-latitude', 'Широта должна содержать не более 10 цифр и 7 знаков после запятой.', (value) =>
									maxDigits(value, { maxDigits: 10, decimalPlaces: 7 })
								),
						longitude:
							Yup.number().required("Это обязательное поле").min(-90, 'Долгота должна быть в диапазоне от -90 до 90.')
								.max(90, 'Долгота должна быть в диапазоне от -90 до 90.')
								.test('is-valid-longitude', 'Долгота должна содержать не более 10 цифр и 7 знаков после запятой.', (value) =>
									maxDigits(value, { maxDigits: 10, decimalPlaces: 7 })
							),
					})}
					onSubmit={handleSubmit}
				>
					{(form) => (
						<form className="Modal-Portal-Form" onSubmit={form.handleSubmit}>
							<uikit.Text
								className="Modal-Portal-Header"
								as="p"
								size="l"
								view="secondary"
							>
								{{
									[MODAL_STATES_CONST.CREATE]: "Создание",
									[MODAL_STATES_CONST.UPDATE]: "Редактирование",
									[MODAL_STATES_CONST.DELETE]: "Удаление",
								}?.[modalState] || "Действие"}
							</uikit.Text>

							<div className="Modal-Portal-Body">
								{fields
									.filter((v) => v.type !== 'toolbar')
									.map((v) => (
										<TextField
											className="Modal-Portal-TextField"
											type={v.type}
											width="full"
											label={v.title}
											name={v.accessor}
											key={v.accessor}
											form={form}
											disabled={modalState === MODAL_STATES_CONST.DELETE}
										/>
									))}
							</div>

							<div className="Modal-Portal-Footer">
								<uikit.Button
									size="m"
									view="primary"
									label={
										{
											[MODAL_STATES_CONST.CREATE]: "Создать",
											[MODAL_STATES_CONST.UPDATE]: "Сохранить",
											[MODAL_STATES_CONST.DELETE]: "Удалить",
										}?.[modalState] || "Выполнить"
									}
									width="default"
									type="submit"
									disabled={formState !== FORM_STATES_CONST.DEFAULT}
								/>
							</div>
						</form>
					)}
				</Formik>
			</uikit.Modal>
		</div>
	);
}

function TrackersTable({ organization }) {
	const { isSmart } = utils.useMediaQuery();

	const list = trackers.useList({ organization_id: organization.id });
	const createOne = trackers.useCreate({
		organization_id: organization.id
	});
	const updateOne = trackers.useUpdate({
		organization_id: organization.id,
	});
	const deleteOne = trackers.useDelete({
		organization_id: organization.id,
	});

	const info = {
		"title": {
			title: "Название",
			accessor: "title",
			type: "text",
		},
		"description": {
			title: "Описание",
			accessor: "description",
			type: "text",
		},
		"id": {
			title: "Идентификатор",
			accessor: "id",
			type: "text",
		},
		"facility": {
			title: "Идентификатор Объекта",
			accessor: "facility",
			type: "text",
		},
	};

	const cols = [
		info["title"],
		info["description"],
		info["id"],
	];

	const fields = [
		info["title"],
		info["description"],
		info["facility"],
	];

	const rows = list.data || [];

	const [isModalOpen, setIsModalOpen] = React.useState(false);
	const [modalState, setModalState] = React.useState(null);

	const handleOpen = (action) => {
		setModalState(action);
		setIsModalOpen(true);
	};

	const handleClose = () => {
		setIsModalOpen(false);
	};

	const [formState, setFormState] = React.useState(FORM_STATES_CONST.DEFAULT);
	const [trackerData, setTrackerData] = React.useState(null);

	const handleSubmit = async (data) => {
		if (formState !== FORM_STATES_CONST.DEFAULT) return;
		data.facility_id = data.facility;
		delete data.facility

		setFormState(FORM_STATES_CONST.LOADING);

		switch (modalState) {
			case MODAL_STATES_CONST.CREATE:
				await createOne.mutateAsync({ data });
				break;
			case MODAL_STATES_CONST.UPDATE:
				await updateOne.mutateAsync({ tracker_id: trackerData.id, data });
				break;
			case MODAL_STATES_CONST.DELETE:
				await deleteOne.mutateAsync({ tracker_id: trackerData.id, data });
				break;

			default:
				break;
		}

		setFormState(FORM_STATES_CONST.LOADED);

		setTimeout(() => {
			setFormState(FORM_STATES_CONST.DEFAULT);
			handleClose();
		}, 320);
	};

	cols.push({
		type: "toolbar",
		title: "Действия",
		accessor: "actions",
		renderCell: (row) => {
			return (
				<>
					<ActionButton
						className={cn("Button-One")}
						size="xs"
						text="Редактировать"
						icon={uikit.Icons.Edit}
						onClick={() =>
							setTrackerData(row) | handleOpen(MODAL_STATES_CONST.UPDATE)
						}
					/>

					<ActionButton
						className={cn("Button-One")}
						size="xs"
						text="Удалить"
						icon={uikit.Icons.Trash}
						onClick={() =>
							setTrackerData(row) | handleOpen(MODAL_STATES_CONST.DELETE)
						}
					/>
				</>
			);
		},
	});

	return (
		<div className={cn("Group")}>
			<uikit.Text className={cn("Group-Title")} view="secondary">
				Трекеры организации
			</uikit.Text>
			<uikit.Table
				className={cn("Table")}
				columns={cols}
				rows={rows}
				borderBetweenColumns
				borderBetweenRows
			/>
			<ActionButton
				className={cn("Button-Add")}
				icon={uikit.Icons.Add}
				text="Добавить"
				onClick={() =>
					setTrackerData(null) | handleOpen(MODAL_STATES_CONST.CREATE)
				}
			/>
			<uikit.Modal
				className="Modal-Portal"
				hasOverlay
				isOpen={isModalOpen}
				onClickOutside={() => handleClose()}
				onEsc={() => handleClose()}
				style={{ maxWidth: isSmart ? "640px" : "90%" }}
			>
				<Formik
					initialValues={{
						title: trackerData?.title || "",
						description: trackerData?.description || "",
						facility: trackerData?.facility || "",
					}}
					validationSchema={Yup.object({
						title: Yup.string().trim().required("Это обязательное поле"),
						description: Yup.string().trim().required("Это обязательное поле"),
						facility: Yup.string().trim().required("Это обязательное поле"),
					})}
					onSubmit={handleSubmit}
				>
					{(form) => (
						<form className="Modal-Portal-Form" onSubmit={form.handleSubmit}>
							<uikit.Text
								className="Modal-Portal-Header"
								as="p"
								size="l"
								view="secondary"
							>
								{{
									[MODAL_STATES_CONST.CREATE]: "Создание",
									[MODAL_STATES_CONST.UPDATE]: "Редактирование",
									[MODAL_STATES_CONST.DELETE]: "Удаление",
								}?.[modalState] || "Действие"}
							</uikit.Text>

							<div className="Modal-Portal-Body">
								{fields
									.filter((v) => v.type !== 'toolbar')
									.map((v) => (
										<TextField
											className="Modal-Portal-TextField"
											type="text"
											width="full"
											label={v.title}
											name={v.accessor}
											key={v.accessor}
											form={form}
											disabled={modalState === MODAL_STATES_CONST.DELETE}
										/>
									))}
							</div>

							<div className="Modal-Portal-Footer">
								<uikit.Button
									size="m"
									view="primary"
									label={
										{
											[MODAL_STATES_CONST.CREATE]: "Создать",
											[MODAL_STATES_CONST.UPDATE]: "Сохранить",
											[MODAL_STATES_CONST.DELETE]: "Удалить",
										}?.[modalState] || "Выполнить"
									}
									width="default"
									type="submit"
									disabled={formState !== FORM_STATES_CONST.DEFAULT}
								/>
							</div>
						</form>
					)}
				</Formik>
			</uikit.Modal>
		</div>
	);
}

function UsersTable({ organization }) {
	const { isSmart } = utils.useMediaQuery();

	const list = users.useList({ organization_id: organization.id });
	const createOne = users.useCreate({ organization_id: organization.id });
	const updateOne = users.useUpdate({ organization_id: organization.id });
	const deleteOne = users.useDelete({ organization_id: organization.id });

	const info = {
		"email": {
			"title": "Электронная почта",
			"accessor": "email",
			"type": "input"
		},
		"password": {
			"title": "Пароль",
			"accessor": "password",
			"type": "input"
		},
		"first_name": {
			"title": "Имя",
			"accessor": "first_name",
			"type": "input"
		},
		"last_name": {
			"title": "Фамилия",
			"accessor": "last_name",
			"type": "input"
		},
		"middle_name": {
			"title": "Отчество",
			"accessor": "middle_name",
			"type": "input"
		},
		"identifier_number": {
			"title": "ИИН",
			"accessor": "identifier_number",
			"type": "input"
		},
		"phone_number": {
			"title": "Номер телефона",
			"accessor": "phone_number",
			"type": "input"
		},
		"position": {
			"title": "Должность",
			"accessor": "position",
			"type": "input"
		},
	};

	const cols = [
		info["email"],
		info["first_name"],
		info["last_name"],
		info["position"],
	];

	const fields = [
		info["email"],
		info["password"],
		info["first_name"],
		info["last_name"],
		info["middle_name"],
		info["identifier_number"],
		info["phone_number"],
		info["position"],
	];

	const rows = list.data || [];

	const [isModalOpen, setIsModalOpen] = React.useState(false);
	const [modalState, setModalState] = React.useState(null);

	const handleOpen = (action) => {
		setModalState(action);
		setIsModalOpen(true);
	};

	const handleClose = () => {
		setIsModalOpen(false);
	};

	const [formState, setFormState] = React.useState(FORM_STATES_CONST.DEFAULT);
	const [userData, setUserData] = React.useState(null);

	const handleSubmit = async (data) => {
		if (formState !== FORM_STATES_CONST.DEFAULT) return;

		setFormState(FORM_STATES_CONST.LOADING);

		switch (modalState) {
			case MODAL_STATES_CONST.CREATE:
				await createOne.mutateAsync({ data });
				break;
			case MODAL_STATES_CONST.UPDATE:
				await updateOne.mutateAsync({ user_id: userData.id, data });
				break;
			case MODAL_STATES_CONST.DELETE:
				await deleteOne.mutateAsync({ user_id: userData.id, data });
				break;

			default:
				break;
		}

		setFormState(FORM_STATES_CONST.LOADED);

		setTimeout(() => {
			setFormState(FORM_STATES_CONST.DEFAULT);
			handleClose();
		}, 320);
	};

	cols.push({
		type: "toolbar",
		title: "Действия",
		accessor: "actions",
		renderCell: (row) => {
			return (
				<>
					<ActionButton
						className={cn("Button-One")}
						size="xs"
						text="Редактировать"
						icon={uikit.Icons.Edit}
						onClick={() =>
							setUserData(row) | handleOpen(MODAL_STATES_CONST.UPDATE)
						}
					/>

					<ActionButton
						className={cn("Button-One")}
						size="xs"
						text="Удалить"
						icon={uikit.Icons.Trash}
						onClick={() =>
							setUserData(row) | handleOpen(MODAL_STATES_CONST.DELETE)
						}
					/>
				</>
			);
		},
	});

	return (
		<div className={cn("Group")}>
			<uikit.Text className={cn("Group-Title")} view="secondary">
				Пользователи организации
			</uikit.Text>
			<uikit.Table
				className={cn("Table")}
				columns={cols}
				rows={rows}
				borderBetweenColumns
				borderBetweenRows
			/>
			<ActionButton
				className={cn("Button-Add")}
				icon={uikit.Icons.Add}
				text="Добавить"
				onClick={() =>
					setUserData(null) | handleOpen(MODAL_STATES_CONST.CREATE)
				}
			/>
			<uikit.Modal
				className="Modal-Portal"
				hasOverlay
				isOpen={isModalOpen}
				onClickOutside={() => handleClose()}
				onEsc={() => handleClose()}
				style={{ maxWidth: isSmart ? "640px" : "90%" }}
			>
				<Formik
					initialValues={{
						title: userData?.title || "",
						description: userData?.description || "",
						country: userData?.country || "",
						city: userData?.city || "",
						street: userData?.street || "",
						number: userData?.number || "",
						longitude: userData?.longitude || "",
						latitude: userData?.latitude || "",
					}}
					validationSchema={Yup.object({
						email: Yup.string().trim().email("Неверный адрес почты").required("Это обязательное поле"),
						password: Yup.string().trim(),
						first_name: Yup.string().trim(),
						last_name: Yup.string().trim().required("Это обязательное поле"),
						middle_name: Yup.string().trim().required("Это обязательное поле"),
						identifier_number: Yup.string().trim().required("Это обязательное поле"),
						phone_number: Yup.string().trim().required("Это обязательное поле"),
						position: Yup.string().trim().required("Это обязательное поле"),
					})}
					onSubmit={handleSubmit}
				>
					{(form) => (
						<form className="Modal-Portal-Form" onSubmit={form.handleSubmit}>
							<uikit.Text
								className="Modal-Portal-Header"
								as="p"
								size="l"
								view="secondary"
							>
								{{
									[MODAL_STATES_CONST.CREATE]: "Создание",
									[MODAL_STATES_CONST.UPDATE]: "Редактирование",
									[MODAL_STATES_CONST.DELETE]: "Удаление",
								}?.[modalState] || "Действие"}
							</uikit.Text>

							<div className="Modal-Portal-Body">
								{fields
									.filter((v) => v.type !== 'toolbar')
									.map((v) => (
										<TextField
											className="Modal-Portal-TextField"
											type={v.type}
											width="full"
											label={v.title}
											name={v.accessor}
											key={v.accessor}
											form={form}
											disabled={modalState === MODAL_STATES_CONST.DELETE}
										/>
									))}
							</div>

							<div className="Modal-Portal-Footer">
								<uikit.Button
									size="m"
									view="primary"
									label={
										{
											[MODAL_STATES_CONST.CREATE]: "Создать",
											[MODAL_STATES_CONST.UPDATE]: "Сохранить",
											[MODAL_STATES_CONST.DELETE]: "Удалить",
										}?.[modalState] || "Выполнить"
									}
									width="default"
									type="submit"
									disabled={formState !== FORM_STATES_CONST.DEFAULT}
								/>
							</div>
						</form>
					)}
				</Formik>
			</uikit.Modal>
		</div>
	);
}

function ActionButton({ className, icon, text, onClick, ...props }) {
	const { isTablet } = utils.useMediaQuery();
	const [isVisible, setVisibility] = React.useState(false);
	const ref = React.useRef(null);

	return (
		<>
			<uikit.Button
				className={className}
				type="button"
				size="s"
				view="ghost"
				onlyIcon
				iconLeft={icon}
				onClick={onClick}
				onMouseEnter={() => isTablet && setVisibility(true)}
				onMouseLeave={() => setVisibility(false)}
				ref={ref}
				{...props}
			/>

			{isVisible && (
				<uikit.Tooltip
					direction="upCenter"
					isInteractive={false}
					anchorRef={ref}
				>
					<uikit.Text size="xs">{text}</uikit.Text>
				</uikit.Tooltip>
			)}
		</>
	);
}

export { ItemEdit };
