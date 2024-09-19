import Instance from "./BackendApi";

export const fetchAllTickets = async () => {
    try {
      const response = await Instance.post(`/admin/getAllTicket`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  };