import { useQuery } from "@rocicorp/zero/react";
import { addDays, startOfDay } from "date-fns";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { useCallback, useContext } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { RootStoreContext } from "@/lib/stores/root-store";
import { queries } from "@/lib/zero/queries";
import type { TaskRow } from "@/schema";

const sections = [
  {
    title: "Recent",
    items: [
      { id: "today", title: "Today", url: "/today" },
      { id: "anytime", title: "Anytime", url: "/anytime" },
      { id: "inbox", title: "Inbox", url: "/inbox" },
      { id: "upcoming", title: "Upcoming", url: "/upcoming" },
      { id: "someday", title: "Someday", url: "/someday" },
      { id: "logbook", title: "Logbook", url: "/logbook" },
    ],
  },
];

export const QuickFindCommand = observer(() => {
  const router = useRouter();
  const {
    localStore: {
      quickFindQuery,
      setQuickFindQuery,
      quickFindOpen,
      setQuickFindOpen,
      setSelectedTaskIds,
    },
  } = useContext(RootStoreContext);

  // Fetch all non-archived, non-completed tasks
  const [filteredTasks] = useQuery(
    queries.tasks.search({ query: quickFindQuery }),
    !!quickFindQuery
  );

  const handleSelect = useCallback(
    (url: string) => {
      setQuickFindOpen(false);
      router.push(url);
    },
    [router, setQuickFindOpen]
  );

  const handleTaskSelect = useCallback(
    (task: TaskRow) => {
      setQuickFindOpen(false);

      // Set the selected task ID first
      setSelectedTaskIds([task.id]);

      // Determine which route to navigate to based on task properties
      let targetRoute = "/inbox"; // default route

      if (task.completed_at) {
        targetRoute = "/logbook";
      } else if (task.archived_at) {
        targetRoute = "/trash";
      } else {
        switch (task.start) {
          case "started": {
            if (!task.start_date) {
              targetRoute = "/anytime";
              break;
            }

            const tomorrow = addDays(startOfDay(new Date()), 1).getTime();
            targetRoute = task.start_date < tomorrow ? "/today" : "/upcoming";
            break;
          }
          case "someday":
            // Someday tasks have start='started' and no start_date
            targetRoute = "/someday";
            break;
          case "not_started":
            targetRoute = "/inbox";
            break;
          default:
            targetRoute = "/inbox";
            break;
        }
      }

      router.push(targetRoute);
    },
    [router, setQuickFindOpen, setSelectedTaskIds]
  );

  return (
    <CommandDialog onOpenChange={setQuickFindOpen} open={quickFindOpen}>
      <CommandInput
        onValueChange={setQuickFindQuery}
        placeholder="Quick Find"
        value={quickFindQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {quickFindQuery.length > 0 && filteredTasks?.length > 0 && (
          <CommandGroup heading="Tasks">
            {filteredTasks.map((task) => (
              <CommandItem
                key={task.id}
                onSelect={() => handleTaskSelect(task)} // Make value more unique
                value={`task-${task.id}-${task.title}`}
              >
                {task.title}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Show standard sections when not searching */}
        {!quickFindQuery &&
          sections.map((section) => (
            <CommandGroup heading={section.title} key={section.title}>
              {section.items.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => handleSelect(item.url)}
                >
                  <div className="flex w-full items-center justify-between">
                    <span>{item.title}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
      </CommandList>
    </CommandDialog>
  );
});
