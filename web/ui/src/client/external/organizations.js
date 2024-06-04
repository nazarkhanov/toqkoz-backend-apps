import axios from "./axios";
import * as query from "react-query";
import * as errors from "./errors";

export const useList = () =>
	query.useQuery({
		queryKey: ["organizations"],

		async queryFn() {
			let response, error;

			try {
				response = await axios.get("/organizations/");
			} catch (e) {
				response = e.response;
				error = e;
			}

			if (response.status !== 200) throw new errors.Unknown(error);

			// fix in the future
			if (Array.isArray(response.data)) response.data = response.data.reverse();

			return response.data;
		},
	});

export const useItem = ({ id }) =>
	query.useQuery({
		queryKey: [`organization-${id}`],

		async queryFn() {
			let response, error;

			try {
				response = await axios.get(`/organizations/${id}/`);
			} catch (e) {
				response = e.response;
				error = e;
			}

			if (response.status === 404) throw new errors.NotFound(error);
			else if (response.status !== 200) throw new errors.Unknown(error);

			return response.data;
		},
	});

export const useCreate = () => {
	const client = query.useQueryClient();

	return query.useMutation({
		async mutationFn() {
			let response, error;

			try {
				response = await axios.post("/organizations/");
			} catch (e) {
				response = e.response;
				error = e;
			}

			if (response.status !== 201) throw new errors.Unknown(error);

			return response.data;
		},

		async onSuccess() {
			client.invalidateQueries({ queryKey: ["organizations"] });
		},
	});
};

export const useDelete = () => {
	const client = query.useQueryClient();

	return query.useMutation({
		async mutationFn(id) {
			let response, error;

			try {
				response = await axios.delete(`/organizations/${id}/`);
			} catch (e) {
				response = e.response;
				error = e;
			}

			if (response.status !== 204) throw new errors.Unknown(error);

			return response.data;
		},

		async onSuccess() {
			client.invalidateQueries({ queryKey: ["organizations"] });
		},
	});
};

export const useUpdate = ({ id }) => {
	const client = query.useQueryClient();

	return query.useMutation({
		async mutationFn(data) {
			let response, error;

			try {
				response = await axios.patch(`/organizations/${id}/`, data);
			} catch (e) {
				response = e.response;
				error = e;
			}

			if (response.status !== 200) throw new errors.Unknown(error);

			return response.data;
		},

		async onSuccess() {
			client.invalidateQueries({ queryKey: [`organization-${id}`] });
		},
	});
};
