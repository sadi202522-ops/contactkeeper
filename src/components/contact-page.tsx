
"use client";

import { useState, useMemo, useEffect, useContext } from "react";
import type { Contact } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { PlusCircle, LogOut } from "lucide-react";
import { ContactForm } from "./contact-form";
import { ContactList } from "./contact-list";
import { Logo } from "./icons";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "firebase/auth";

export function ContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "contacts"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const contactsData = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Contact)
      );
      setContacts(contactsData);
    });
    return () => unsubscribe();
  }, [user]);

  const handleAddContact = () => {
    setContactToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setContactToEdit(contact);
    setIsFormOpen(true);
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!user) return;
    await deleteDoc(doc(db, "contacts", contactId));
  };

  const handleSaveContact = async (contact: Contact) => {
    if (!user) return;
    const isEditing = contacts.some((c) => c.id === contact.id);
    if (isEditing) {
      const docRef = doc(db, "contacts", contact.id);
      await updateDoc(docRef, { ...contact });
    } else {
      await addDoc(collection(db, "contacts"), {
        ...contact,
        userId: user.uid,
      });
    }
  };
  
  const handleSignOut = async () => {
    await signOut(auth);
  };

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortedContacts = useMemo(() => {
    return [...contacts].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  }, [contacts, sortOrder]);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Logo />
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Contact Keeper
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handleAddContact}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="bg-card p-4 sm:p-6 rounded-xl shadow-sm">
        <ContactList
          contacts={sortedContacts}
          onEdit={handleEditContact}
          onDelete={handleDeleteContact}
          onSort={handleSort}
          sortOrder={sortOrder}
        />
      </div>

      <ContactForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveContact}
        contactToEdit={contactToEdit}
      />
    </div>
  );
}
