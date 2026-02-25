"use client";

/**
 * Company Profile Page
 * Full Indonesian business profile with NPWP, PKP, business entity, and bank details
 * Fully localized
 */

import { useState, useEffect } from "react";
import { useCompany, useUpdateCompany } from "@/hooks/use-company";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  formatNPWP,
  validateNPWP,
  cleanNPWP,
  BUSINESS_ENTITIES,
} from "@/lib/indonesian-utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { data: companyData, isLoading } = useCompany();
  const updateCompany = useUpdateCompany();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [businessEntity, setBusinessEntity] = useState<string>("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [npwp, setNpwp] = useState("");
  const [isPkp, setIsPkp] = useState(false);
  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankAccountHolder, setBankAccountHolder] = useState("");
  const [defaultPpnRate, setDefaultPpnRate] = useState(11);

  useEffect(() => {
    if (companyData?.success && companyData.data) {
      const company = companyData.data;
      setName(company.name);
      setBusinessEntity(company.businessEntity || "");
      setAddress(company.address || "");
      setEmail(company.email || "");
      setPhone(company.phone || "");
      setNpwp(company.npwp || "");
      setIsPkp(company.isPkp);
      setBankName(company.bankName || "");
      setBankAccountNumber(company.bankAccountNumber || "");
      setBankAccountHolder(company.bankAccountHolder || "");
      setDefaultPpnRate(company.defaultPpnRate);
    }
  }, [companyData]);

  const handleNpwpChange = (value: string) => {
    const cleaned = cleanNPWP(value);
    if (cleaned.length <= 15) {
      if (cleaned.length === 15) {
        setNpwp(formatNPWP(cleaned));
      } else {
        setNpwp(cleaned);
      }
    }
  };

  const handleSave = async () => {
    // Validate NPWP if provided
    if (npwp && !validateNPWP(npwp) && npwp.length === 15) {
      toast({
        title: "Invalid tax ID",
        description: "Tax ID format: XX.XXX.XXX.X-XXX.XXX",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateCompany.mutateAsync({
        name,
        businessEntity: businessEntity || undefined,
        address: address || undefined,
        email: email || undefined,
        phone: phone || undefined,
        npwp: npwp || undefined,
        isPkp,
        bankName: bankName || undefined,
        bankAccountNumber: bankAccountNumber || undefined,
        bankAccountHolder: bankAccountHolder || undefined,
        defaultPpnRate,
      });

      toast({
        title: "Profile saved successfully",
        description: "Your company information has been updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Company Profile
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your business information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Your company's primary information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                placeholder="Example Company Inc."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessEntity">
                Business Entity
              </Label>
              <Select value={businessEntity} onValueChange={setBusinessEntity}>
                <SelectTrigger id="businessEntity">
                  <SelectValue placeholder="Select business entity" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_ENTITIES.map((entity) => (
                    <SelectItem key={entity.value} value={entity.value}>
                      {entity.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+62 21 1234 5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Jl. Sudirman No. 123, Jakarta"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tax Information</CardTitle>
          <CardDescription>
            Tax ID and taxable entity status for tax compliance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="npwp">NPWP (Nomor Pokok Wajib Pajak)</Label>
              <Input
                id="npwp"
                placeholder="XX.XXX.XXX.X-XXX.XXX"
                value={npwp}
                onChange={(e) => handleNpwpChange(e.target.value)}
                maxLength={20}
              />
              {npwp && !validateNPWP(npwp) && npwp.length >= 15 && (
                <p className="text-sm text-red-500">Invalid tax ID</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultPpnRate">Default VAT Rate (%)</Label>
              <Input
                id="defaultPpnRate"
                type="number"
                min="0"
                max="100"
                value={defaultPpnRate}
                onChange={(e) =>
                  setDefaultPpnRate(parseFloat(e.target.value) || 11)
                }
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="isPkp" checked={isPkp} onCheckedChange={setIsPkp} />
            <Label htmlFor="isPkp" className="cursor-pointer">
              Taxable Entity (PKP)
            </Label>
          </div>
          {isPkp && (
            <p className="text-sm text-gray-600">
              PKP status allows you to collect VAT
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bank Information</CardTitle>
          <CardDescription>
            Account details for payment instructions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                placeholder="Bank BCA, Mandiri, BNI, etc."
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankAccountNumber">
                Account Number
              </Label>
              <Input
                id="bankAccountNumber"
                placeholder="1234567890"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankAccountHolder">
              Account Holder Name
            </Label>
            <Input
              id="bankAccountHolder"
                placeholder="Example Company Inc."
              value={bankAccountHolder}
              onChange={(e) => setBankAccountHolder(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={!name || updateCompany.isPending}
          size="lg"
        >
          {updateCompany.isPending
            ? "Saving..."
            : "Save Profile"}
        </Button>
      </div>
    </div>
  );
}
