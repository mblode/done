import { observer } from "mobx-react-lite";
import { useContext } from "react";

import { RootStoreContext } from "@/lib/stores/root-store";

import { WhenDialog } from "./when-dialog";

export const WhenDialogWrapper = observer(() => {
  const {
    localStore: { selectedTaskIds, whenOpen, setWhenOpen, whenState },
  } = useContext(RootStoreContext);

  if (whenState.type === "single") {
    if (!whenState.task) return null;

    return (
      <WhenDialog
        type="single"
        task={whenState.task}
        immediate={whenState.immediate}
        open={whenOpen}
        setOpen={setWhenOpen}
      />
    );
  }

  return (
    <WhenDialog
      type="multiple"
      taskIds={Array.from(selectedTaskIds)}
      open={whenOpen}
      setOpen={setWhenOpen}
    />
  );
});
