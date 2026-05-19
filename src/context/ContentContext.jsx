import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { defaultContent } from "../data/defaultContent";
import { fetchContent, saveContent as persistContent } from "../lib/api";

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(null);

  const loadContent = useCallback(async () => {
    setLoading(true);
    const remote = await fetchContent();
    setContent(remote || defaultContent);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const updateContent = useCallback((updater) => {
    setContent((current) => (typeof updater === "function" ? updater(current) : updater));
    setSaveStatus(null);
  }, []);

  const saveContent = useCallback(async () => {
    const result = await persistContent(content);
    if (result.ok) {
      setSaveStatus(result.warning || "Saved successfully.");
      return true;
    }
    setSaveStatus(result.error || "Save failed.");
    return false;
  }, [content]);

  const value = useMemo(
    () => ({
      content,
      loading,
      saveStatus,
      updateContent,
      saveContent,
      reloadContent: loadContent,
    }),
    [content, loading, saveStatus, updateContent, saveContent, loadContent],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within ContentProvider");
  }
  return context;
}
