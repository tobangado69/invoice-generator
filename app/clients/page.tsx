"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  useClients,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
  type Client,
} from "@/hooks/use-clients";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Users,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { formatNPWP, validateNPWP, cleanNPWP } from "@/lib/indonesian-utils";

function ClientForm({
  client,
  onSave,
  onCancel,
  isPending,
}: {
  client?: Client;
  onSave: (data: Partial<Client>) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [name, setName] = useState(client?.name || "");
  const [email, setEmail] = useState(client?.email || "");
  const [phone, setPhone] = useState(client?.phone || "");
  const [address, setAddress] = useState(client?.address || "");
  const [npwp, setNpwp] = useState(client?.npwp || "");
  const [contactPerson, setContactPerson] = useState(
    client?.contactPerson || ""
  );
  const [notes, setNotes] = useState(client?.notes || "");

  const handleNpwpChange = (value: string) => {
    const cleaned = cleanNPWP(value);
    if (cleaned.length <= 15) {
      setNpwp(cleaned.length === 15 ? formatNPWP(cleaned) : cleaned);
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({
      name,
      email: email || undefined,
      phone: phone || undefined,
      address: address || undefined,
      npwp: npwp || undefined,
      contactPerson: contactPerson || undefined,
      notes: notes || undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Client Name *</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Example Client Inc."
          />
        </div>
        <div className="space-y-2">
          <Label>Contact Person</Label>
          <Input
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            placeholder="Contact name"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="client@email.com"
          />
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+62 812 3456 7890"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Address</Label>
        <Textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Jl. Sudirman No. 123, Jakarta"
          rows={2}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>NPWP</Label>
          <Input
            value={npwp}
            onChange={(e) => handleNpwpChange(e.target.value)}
            placeholder="XX.XXX.XXX.X-XXX.XXX"
            maxLength={20}
          />
          {npwp && !validateNPWP(npwp) && npwp.length >= 15 && (
            <p className="text-sm text-red-500">Invalid tax ID format</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Notes</Label>
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!name.trim() || isPending}>
          {isPending ? "Saving..." : client ? "Update" : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>();
  const { toast } = useToast();

  const { data: clientsData, isLoading } = useClients(search || undefined);
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();
  const deleteMutation = useDeleteClient();

  const clients =
    clientsData && "data" in clientsData && clientsData.success
      ? clientsData.data
      : [];

  const handleCreate = async (data: Partial<Client>) => {
    try {
      await createMutation.mutateAsync(data);
      toast({ title: "Client added", description: `${data.name} saved successfully` });
      setDialogOpen(false);
    } catch {
      toast({ title: "Error", description: "Failed to add client", variant: "destructive" });
    }
  };

  const handleUpdate = async (data: Partial<Client>) => {
    if (!editingClient) return;
    try {
      await updateMutation.mutateAsync({ id: editingClient.id, data });
      toast({ title: "Client updated", description: `${data.name} updated successfully` });
      setEditingClient(undefined);
      setDialogOpen(false);
    } catch {
      toast({ title: "Error", description: "Failed to update client", variant: "destructive" });
    }
  };

  const handleDelete = async (client: Client) => {
    if (!confirm(`Delete client "${client.name}"?`)) return;
    try {
      await deleteMutation.mutateAsync(client.id);
      toast({ title: "Client deleted", description: `${client.name} deleted successfully` });
    } catch {
      toast({ title: "Error", description: "Failed to delete client", variant: "destructive" });
    }
  };

  const openEdit = (client: Client) => {
    setEditingClient(client);
    setDialogOpen(true);
  };

  const openCreate = () => {
    setEditingClient(undefined);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">
            Clients
          </h1>
          <p className="text-muted-foreground">
            Manage your client database
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingClient ? "Edit Client" : "Add New Client"}
              </DialogTitle>
              <DialogDescription>
                {editingClient
                  ? "Update client information"
                  : "Add a new client to your database"}
              </DialogDescription>
            </DialogHeader>
            <ClientForm
              client={editingClient}
              onSave={editingClient ? handleUpdate : handleCreate}
              onCancel={() => setDialogOpen(false)}
              isPending={createMutation.isPending || updateMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </section>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients..."
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : clients.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {search ? "No results" : "No clients yet"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {search
                ? "Try a different keyword"
                : "Add your first client to get started"}
            </p>
            {!search && (
              <Button onClick={openCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Add Client
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">
                      {client.name}
                    </CardTitle>
                    {client.contactPerson && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {client.contactPerson}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEdit(client)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDelete(client)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {client.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>{client.phone}</span>
                  </div>
                )}
                {client.address && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{client.address}</span>
                  </div>
                )}
                {client.npwp && (
                  <Badge variant="outline" className="text-xs">
                    NPWP: {client.npwp}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
