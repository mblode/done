import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useZero } from "@/hooks/use-zero";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import { v4 } from "uuid";
import { InputField } from "../fields/input-field";
import { TextareaField } from "../fields/textarea-field";

const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

type Props = {
  /** If id is defined the task created by the composer. */
  onClose: (id?: string | undefined) => void;
  open: boolean;
};

export const NewTaskDialog = ({ open, onClose }: Props) => {
  const z = useZero();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = (data: TaskFormValues) => {
    const id = v4();
    z.mutate.task.insert({
      id,
      workspace_id: `b1b6643f-e485-4a11-947c-af24dc7d17ee`,
      title: data.title,
      description: data.description,
      created_at: Date.now(),
      creator_id: z.userID,
      updated_at: Date.now(),
      start: "not_started",
      start_bucket: "inbox",
    });
    form.reset();
    onClose(id);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>New task</DialogTitle>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="px-4">
              <InputField
                control={form.control}
                name="title"
                placeholder="Task title"
                autoFocus
              />
            </div>

            <div className="px-4">
              <TextareaField
                control={form.control}
                name="description"
                placeholder="Add description..."
              />
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="modal-confirm"
                disabled={!form.formState.isValid}
              >
                Save task
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
