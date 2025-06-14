import { _listAllUsers } from "$lib/firebase/users";
import type { PageServerLoad } from "../../home/view_requests/[id]/$types";


export const load: PageServerLoad = async () => {
  const users = await _listAllUsers();
  return {
    users
  };
};

