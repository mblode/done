import { observer } from "mobx-react-lite";
import { useContext } from "react";

import { RootStoreContext } from "@/lib/stores/root-store";

import { WhenDialog } from "./when-dialog";

export const WhenDialogWrapper = observer(() => {
  const {
    localStore: { selectedTaskIds, whenOpen, setWhenOpen, whenState },
  } = useContext(RootStoreContext);

  if (whenState.type === "single") {
    if (!whenState.task) {
      return null;
    }

    return (
      <WhenDialog
        immediate={whenState.immediate}
        open={whenOpen}
        setOpen={setWhenOpen}
        task={whenState.task}
        type="single"
      />
    );
  }

  return (
    <WhenDialog
      open={whenOpen}
      setOpen={setWhenOpen}
      taskIds={Array.from(selectedTaskIds)}
      type="multiple"
    />
  );
});
