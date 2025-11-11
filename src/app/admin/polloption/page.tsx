import PollOptionForm from "./_components/PollOptionForm";
import PollVoteForm from "./_components/PollVoteForm";
import PollVoteList from "./_components/PollVoteList";

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-8">
        {/* <PollOptionForm />
        <PollOptionList /> */}
        <PollVoteForm />
        <PollVoteList />
      </div>
    </div>
  );
}