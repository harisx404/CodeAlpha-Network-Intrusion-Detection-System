export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex justify-center items-center h-64 text-red-500">
      {message}
    </div>
  );
}
