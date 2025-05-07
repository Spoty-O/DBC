import { useQuery } from "react-query";
import { QUERY_KEYS } from "../consts/query.keys";
import { isAxiosError } from "axios";
import Swal from "sweetalert2";
import { useStaffStore } from "../../store/staff.store";
import { staffService } from "../../services/staff.service";

export const useStaff = () => {
  const { setStaff } = useStaffStore();

  useQuery({
    queryKey: [QUERY_KEYS.STAFF],
    queryFn: async () => staffService.getAll(),
    onSuccess: (data) => {
      setStaff(data);
    },
    onError: (error) => {
      setStaff([]);
      if (isAxiosError(error)) {
        Swal.fire({
          icon: "error",
          title: "Request error",
          text: error.response?.data.messages[0] as string,
        });
      }
    },
    refetchOnMount: false,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
