import { useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { searchConversationHistory } from "../actions/copilotActions";
import { useRouter, usePathname } from "next/navigation";

interface Item {
  id: string;
  name: string;
}

interface SearchListProps {
  projectId: string;
}

export default function SearchList({ projectId }: SearchListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname(); // Get the current pathname
  const router = useRouter();

  const fetchConversationHistory = async () => {
    const data = await searchConversationHistory(projectId, searchQuery);
    const items: Item[] = data.map((item) => {
      return {
        id: item.id,
        name: item.title,
      };
    });
    setItems(items);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      await fetchConversationHistory();
    });
  };

  useEffect(() => {
    startTransition(async () => {
      await fetchConversationHistory();
    });
  }, []);

  return (
    <div className="mx-auto w-full max-w-sm space-y-4">
      <form onSubmit={handleSearch}>
        <Input
          type="search"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="color w-full"
          aria-label="Search items"
        />
      </form>
      <ScrollArea className="h-[300px] w-full rounded-md border">
        {isPending ? (
          <div className="p-4 text-center text-gray-900">Loading...</div>
        ) : (
          <ul className="space-y-2 p-4">
            {items.length === 0 ? (
              <li className="text-center text-gray-900">No results found.</li>
            ) : (
              items.map((item) => (
                <li
                  key={item.id}
                  onClick={() => {
                    // Construct the new URL relative to the current pathname
                    const newPath = `${pathname.replace(/\/$/, "")}/conversations/${item.id}`;
                    router.push(newPath);
                  }}
                  className="cursor-pointer rounded-lg p-3 transition-colors hover:bg-gray-100"
                >
                  {item.name}
                </li>
              ))
            )}
          </ul>
        )}
      </ScrollArea>
    </div>
  );
}
