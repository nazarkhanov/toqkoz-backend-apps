import axios from "./axios";
import * as query from "react-query";
import * as errors from "./errors";

export const useList = ({ organization_id }) =>
	query.useQuery({
		queryKey: [`organization-${organization_id}-trackers`],

		async queryFn() {
			let response, error;

			try {
				response = await axios.get(
					`/organizations/${organization_id}/trackers/`
				);
			} catch (e) {
				response = e.response;
				error = e;
			}

			if (response.status !== 200) throw new errors.Unknown(error);

			return response.data;
		},
	});

export const useCreate = ({ organization_id }) => {
	const client = query.useQueryClient();

	return query.useMutation({
		async mutationFn({ data }) {
			let response, error;

			try {
				response = await axios.post(`/organizations/${organization_id}/trackers/`, data);
			} catch (e) {
				response = e.response;
				error = e;
			}

			if (response.status !== 201) throw new errors.Unknown(error);

			return response.data;
		},

		async onSuccess() {
			client.invalidateQueries({
				queryKey: [`organization-${organization_id}-trackers`],
			});
		},
	});
};

export const useDelete = ({ organization_id }) => {
	const client = query.useQueryClient();

	return query.useMutation({
		async mutationFn({ tracker_id }) {
			let response, error;

			try {
				response = await axios.delete(
					`/organizations/${organization_id}/trackers/${tracker_id}/`
				);
			} catch (e) {
				response = e.response;
				error = e;
			}

			if (response.status !== 204) throw new errors.Unknown(error);

			return response.data;
		},

		async onSuccess() {
			client.invalidateQueries({
				queryKey: [`organization-${organization_id}-trackers`],
			});
		},
	});
};

export const useUpdate = ({ organization_id }) => {
	const client = query.useQueryClient();

	return query.useMutation({
		async mutationFn({ tracker_id, data }) {
			let response, error;

			try {
				response = await axios.patch(
					`/organizations/${organization_id}/trackers/${tracker_id}/`,
					data
				);
			} catch (e) {
				response = e.response;
				error = e;
			}

			if (response.status !== 200) throw new errors.Unknown(error);

			return response.data;
		},

		async onSuccess() {
			client.invalidateQueries({
				queryKey: [`organization-${organization_id}-trackers`],
			});
		},
	});
};
