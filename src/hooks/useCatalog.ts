import { useState, useEffect } from "react";
import { COMPANY } from "@/config/company";

export interface Group {
  slug: string;
  title: string;
  shortTitle: string;
  desc: string;
  metaTitle: string;
  metaDesc: string;
  fullDescription: string;
  image: string;
  categories: string[];
}

export interface Category {
  slug: string;
  title: string;
  desc: string;
  metaTitle: string;
  metaDesc: string;
  fullDescription: string;
  standards: string[];
}

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>(
    (COMPANY.groups as unknown as Group[]) || []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await fetch("/api/groups", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch groups");
      const data = await res.json();
      setGroups(data.groups || COMPANY.groups);
    } catch (err) {
      console.error("Error fetching groups:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      // Fallback to company config
      setGroups(COMPANY.groups as unknown as Group[]);
    } finally {
      setLoading(false);
    }
  };

  return { groups, loading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(
    (COMPANY.categories as unknown as Category[]) || []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data.categories || COMPANY.categories);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      // Fallback to company config
      setCategories(COMPANY.categories as unknown as Category[]);
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, error };
}
