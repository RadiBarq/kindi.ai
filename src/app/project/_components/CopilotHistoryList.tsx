import { useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { searchConversationHistory } from "../actions/copilotActions";
import { useRouter } from "next/navigation";
import ConversationHistory from "../_types/conversationHistory";
import { Button } from "@/components/ui/button";

interface SearchListProps {
  projectId: string;
  conversationsHistory: ConversationHistory[] | null;
}

export default function SearchList({
  projectId,
  conversationsHistory,
}: SearchListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<ConversationHistory[] | null>(
    conversationsHistory,
  );
  const [finishedSearch, setFinishedSearch] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const fetchConversationHistory = async () => {
    try {
      const data = await searchConversationHistory(projectId, searchQuery);
      const items: ConversationHistory[] = data.map((item) => {
        return {
          id: item.id,
          name: item.title,
        };
      });
      setItems(items);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      console.error(error);
      setItems([]);
    } finally {
      setFinishedSearch(true);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isPending || items === null) {
      return;
    }

    startTransition(async () => {
      await fetchConversationHistory();
    });
  };

  useEffect(() => {
    setItems(conversationsHistory);
  }, [conversationsHistory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    if (!query) {
      setItems([]);
    }
    setFinishedSearch(false);
    setSearchQuery(query);
  };

  return (
    <div className="mx-auto w-full max-w-sm space-y-4">
      <form className="flex flex-row space-x-2" onSubmit={handleSearch}>
        <Input
          type="search"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleInputChange}
          className="color w-full"
          aria-label="Search items"
        />
        <Button type="submit" variant="ghost">
          Search
        </Button>
      </form>
      <ScrollArea className="h-[300px] w-full rounded-md border">
        {isPending || items === null ? (
          <div className="p-4 text-center text-gray-900">Loading...</div>
        ) : (
          <ul className="space-y-2 p-4">
            {items.length === 0 && finishedSearch ? (
              <li className="text-center text-gray-900">No results found.</li>
            ) : (
              items.map((item) => (
                <li
                  key={item.id}
                  onClick={() => {
                    router.push(`/project/${projectId}/copilot/${item.id}`);
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
