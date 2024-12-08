import { DynamicImportEditor } from "@/components/editor";

const Note = async ({
  params,
}: {
  params: Promise<{ documentIds?: number[] }>;
}) => {
  const documentIds = (await params).documentIds;

  return (
    <div className="w-full h-full">
      <DynamicImportEditor
        documentId={documentIds ? documentIds[0] : undefined}
      />
    </div>
  );
};
export default Note;
