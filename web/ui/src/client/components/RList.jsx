import "./RList.css";

import * as React from "react";
import * as ReactRouter from "react-router-dom";
import * as utils from "@/shared/utils";
import * as uikit from "@/shared/uikit";
import * as components from "@/components";
import * as organizations from "@/external/organizations";

const cn = utils.useClassName("Cabinet-List");

function List() {
	const layout = ReactRouter.useOutletContext();
	const queryAll = organizations.useList();
	const createOne = organizations.useCreate();
	const deleteOne = organizations.useDelete();

	const data = React.useMemo(
		() =>
			queryAll.data?.filter((item) =>
				item.name.toLowerCase().includes(layout.searchString.toLowerCase())
			),
		[queryAll.data, layout.searchString]
	);

	const { isDesktop, isTablet, isSmart } = utils.useMediaQuery();

	const PagerLeft = () => (
		<uikit.Text view="primary" size="2xl" weight="bold">
			Все организации
		</uikit.Text>
	);

	const PagerRight = () => (
		<uikit.Button
			label="Добавить организацию"
			iconRight={uikit.Icons.Add}
			size="m"
			onClick={() => createOne.mutate()}
			disabled={createOne.isLoading}
		/>
	);

	const DataList = () => (
		<uikit.Grid.Main
			gap="xl"
			cols={isDesktop ? 4 : isTablet ? 3 : isSmart ? 2 : 1}
		>
			{data.map((item) => (
				<uikit.Grid.Item key={item.id}>
					<components.Card
						to={`/cabinet/organizations/${item.id}`}
						status={item.status}
						onClickDelete={() => deleteOne.mutate(item.id)}
					>
						{item.name}
					</components.Card>
				</uikit.Grid.Item>
			))}
		</uikit.Grid.Main>
	);

	const SkeletonList = () => (
		<uikit.Grid.Main
			gap="xl"
			cols={isDesktop ? 4 : isTablet ? 3 : isSmart ? 2 : 1}
		>
			{Array.from(Array(10).keys()).map((item) => (
				<uikit.Grid.Item key={item}>
					<div key={item} className={cn("Skeleton")}>
						<uikit.Skeleton.Brick key={item} height={148} />
					</div>
				</uikit.Grid.Item>
			))}
		</uikit.Grid.Main>
	);

	const EmptyList = () => (
		<uikit.Text className={cn("EmptyList")}>Пусто</uikit.Text>
	);

	return (
		<div className={cn()}>
			<components.Pager
				rowCenter={{
					left: <PagerLeft />,
					right: <PagerRight />,
				}}
			/>

			<div className={cn("All")}>
				{data ? data.length ? <DataList /> : <EmptyList /> : <SkeletonList />}
			</div>
		</div>
	);
}

export { List };
