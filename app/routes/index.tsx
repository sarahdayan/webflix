import { useOptionalUser } from "~/utils";
import { Main } from "~/layout/main";

export default function Index() {
  const user = useOptionalUser();

  return <Main user={user}></Main>;
}
