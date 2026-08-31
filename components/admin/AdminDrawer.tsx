"use client";

import React, { useState, useMemo } from "react";
import { useInventory } from "@/lib/store/inventory-context";
import {
  Vehicle,
  VehicleStatus,
  LeadStatus,
  AppointmentStatus,
} from "@/types";
import {
  X,
  Plus,
  Car,
  Users,
  Settings,
  MessageCircle,
  Phone,
  CheckCircle2,
  Trash2,
  Save,
  BarChart3,
  Calendar,
  Star,
  Search,
  ExternalLink,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Tag,
  AlertCircle,
  Edit2,
  Clock,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import { formatPrice, formatMileage } from "@/lib/utils";
import { TitanLogo } from "@/components/ui/TitanLogo";

type AdminTab = "overview" | "vehicles" | "leads" | "customers" | "appointments" | "reviews" | "analytics" | "settings";

export function AdminDrawer() {
  const {
    isAdminDrawerOpen,
    setIsAdminDrawerOpen,
    vehicles,
    leads,
    customers,
    appointments,
    reviews,
    analyticsEvents,
    tenantConfig,
    updateVehicleStatus,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    toggleFeaturedVehicle,
    updateLeadStatus,
    addLeadNote,
    deleteLead,
    convertLeadToCustomer,
    updateCustomer,
    deleteCustomer,
    updateAppointmentStatus,
    deleteAppointment,
    deleteReview,
    updateTenantConfig,
  } = useInventory();

  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  // Lead search & filter
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>("ALL");
  const [leadSearch, setLeadSearch] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [newLeadNoteText, setNewLeadNoteText] = useState("");

  // Customer search
  const [customerSearch, setCustomerSearch] = useState("");

  // Vehicle form state (Add / Edit)
  const [isEditingVehicle, setIsEditingVehicle] = useState<boolean>(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [vehBrand, setVehBrand] = useState("");
  const [vehModel, setVehModel] = useState("");
  const [vehVersion, setVehVersion] = useState("");
  const [vehYear, setVehYear] = useState<number>(2023);
  const [vehMileage, setVehMileage] = useState<number>(15000);
  const [vehFuel, setVehFuel] = useState("Diesel");
  const [vehTrans, setVehTrans] = useState("Automatique");
  const [vehPrice, setVehPrice] = useState<number | undefined>(4500000);
  const [vehColor, setVehColor] = useState("Gris");
  const [vehBodyType, setVehBodyType] = useState("Berline");
  const [vehImage, setVehImage] = useState("/vehicles/clio5.jpg");
  const [vehDesc, setVehDesc] = useState("");
  const [vehFeatures, setVehFeatures] = useState("Climatisation automatique, Caméra de recul, Écran tactile, Régulateur de vitesse");
  const [vehStatus, setVehStatus] = useState<VehicleStatus>("AVAILABLE");
  const [vehFeatured, setVehFeatured] = useState<boolean>(false);

  // Settings form state
  const [phoneVal, setPhoneVal] = useState(tenantConfig.company.phone || "");
  const [whatsappVal, setWhatsappVal] = useState(tenantConfig.company.whatsapp || "");
  const [emailVal, setEmailVal] = useState(tenantConfig.company.email || "");
  const [addressVal, setAddressVal] = useState(tenantConfig.company.address || "");
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false);

  if (!isAdminDrawerOpen) return null;

  // Overview metrics calculations
  const totalStockCount = vehicles.length;
  const availableStockCount = vehicles.filter((v) => v.status === "AVAILABLE").length;
  const reservedStockCount = vehicles.filter((v) => v.status === "RESERVED").length;
  const soldStockCount = vehicles.filter((v) => v.status === "SOLD").length;
  const totalInventoryValue = vehicles.reduce((sum, v) => sum + (v.price || 0), 0);
  const totalLeadsCount = leads.length;
  const newLeadsCount = leads.filter((l) => l.status === "NEW").length;
  const activeAppointmentsCount = appointments.filter((a) => a.status === "REQUESTED" || a.status === "CONFIRMED").length;

  // Filtered leads
  const filteredLeads = leads.filter((l) => {
    if (leadStatusFilter !== "ALL" && l.status !== leadStatusFilter) return false;
    if (leadSearch.trim()) {
      const q = leadSearch.toLowerCase().trim();
      const matchName = l.fullName.toLowerCase().includes(q);
      const matchPhone = l.phone.includes(q);
      const matchVehicle = l.vehicleTitle ? l.vehicleTitle.toLowerCase().includes(q) : false;
      if (!matchName && !matchPhone && !matchVehicle) return false;
    }
    return true;
  });

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || filteredLeads[0] || null;

  // Filtered customers
  const filteredCustomers = customers.filter((c) => {
    if (customerSearch.trim()) {
      const q = customerSearch.toLowerCase().trim();
      return c.fullName.toLowerCase().includes(q) || c.phone.includes(q) || (c.email && c.email.toLowerCase().includes(q));
    }
    return true;
  });

  // Handle open add vehicle
  const handleOpenAddVehicle = () => {
    setIsEditingVehicle(false);
    setEditingVehicleId(null);
    setVehBrand("");
    setVehModel("");
    setVehVersion("");
    setVehYear(2023);
    setVehMileage(15000);
    setVehFuel("Diesel");
    setVehTrans("Automatique");
    setVehPrice(4500000);
    setVehColor("Gris");
    setVehBodyType("Berline");
    setVehImage("/vehicles/clio5.jpg");
    setVehDesc("");
    setVehFeatures("Climatisation automatique, Caméra de recul, Écran tactile, Régulateur de vitesse");
    setVehStatus("AVAILABLE");
    setVehFeatured(false);
    setShowVehicleForm(true);
  };

  // Handle open edit vehicle
  const handleOpenEditVehicle = (veh: Vehicle) => {
    setIsEditingVehicle(true);
    setEditingVehicleId(veh.id);
    setVehBrand(veh.brand);
    setVehModel(veh.model);
    setVehVersion(veh.version || "");
    setVehYear(veh.year || 2023);
    setVehMileage(veh.mileage || 0);
    setVehFuel(veh.fuelType || "Diesel");
    setVehTrans(veh.transmission || "Automatique");
    setVehPrice(veh.price);
    setVehColor(veh.color || "Gris");
    setVehBodyType(veh.bodyType || "Berline");
    setVehImage(veh.mainImage || "");
    setVehDesc(veh.description || "");
    setVehFeatures(veh.features ? veh.features.join(", ") : "");
    setVehStatus(veh.status);
    setVehFeatured(veh.featured || false);
    setShowVehicleForm(true);
  };

  // Handle Save Vehicle (Create or Edit)
  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehBrand.trim() || !vehModel.trim()) return;

    const payload = {
      brand: vehBrand.trim(),
      model: vehModel.trim(),
      version: vehVersion.trim() || undefined,
      year: vehYear,
      mileage: vehMileage,
      fuelType: vehFuel,
      transmission: vehTrans,
      bodyType: vehBodyType,
      color: vehColor,
      price: vehPrice && vehPrice > 0 ? vehPrice : undefined,
      currency: "DZD",
      status: vehStatus,
      location: `${tenantConfig.company.city}`,
      description: vehDesc.trim() || undefined,
      mainImage: vehImage.trim(),
      gallery: [vehImage.trim()],
      features: vehFeatures.split(",").map((f) => f.trim()).filter(Boolean),
      featured: vehFeatured,
    };

    if (isEditingVehicle && editingVehicleId) {
      updateVehicle(editingVehicleId, payload);
    } else {
      addVehicle(payload);
    }

    setShowVehicleForm(false);
  };

  // Handle Add Lead Note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newLeadNoteText.trim()) return;
    addLeadNote(selectedLead.id, newLeadNoteText.trim());
    setNewLeadNoteText("");
  };

  // Handle Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateTenantConfig({
      company: {
        ...tenantConfig.company,
        phone: phoneVal.trim() || null,
        whatsapp: whatsappVal.trim() || null,
        email: emailVal.trim() || null,
        address: addressVal.trim() || null,
      },
      socials: {
        ...tenantConfig.socials,
        whatsapp: whatsappVal.trim() || null,
      },
    });
    setSavedSettingsSuccess(true);
    setTimeout(() => setSavedSettingsSuccess(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#151515]/60 backdrop-blur-xs animate-fade-in"
      onClick={() => setIsAdminDrawerOpen(false)}
      id="admin-drawer-overlay"
    >
      <div
        className="w-full max-w-4xl bg-[#FFFFFF] h-full flex flex-col border-l border-[#D9D9D4] titan-overlay-shadow"
        onClick={(e) => e.stopPropagation()}
        id="admin-drawer-content"
      >
        {/* Top Header */}
        <div className="bg-[#111111] border-b border-[#303030] p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TitanLogo variant="mark" size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#222222] border border-[#303030] text-[#C62828] text-[10px] font-bold rounded-[4px]">
                  OPÉRATIONNEL
                </span>
              </div>
              <div className="text-[12px] text-[#8A8A8A]">
                Tenant : <code className="font-mono">{tenantConfig.company.id}</code> &bull; Boufarik (Blida) &amp; Alger
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsAdminDrawerOpen(false)}
            className="w-8 h-8 flex items-center justify-center text-[#8A8A8A] hover:text-[#FFFFFF] hover:bg-[#222222] rounded-[6px] border border-[#303030] transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation Menu */}
        <div className="bg-[#111111] border-b border-[#303030] px-4 flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-3 text-[13px] font-medium border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "overview"
                ? "border-[#C62828] text-[#FFFFFF] font-bold"
                : "border-transparent text-[#8A8A8A] hover:text-[#FFFFFF]"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Aperçu KPI</span>
          </button>

          <button
            onClick={() => setActiveTab("vehicles")}
            className={`py-3 px-3 text-[13px] font-medium border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "vehicles"
                ? "border-[#C62828] text-[#FFFFFF] font-bold"
                : "border-transparent text-[#8A8A8A] hover:text-[#FFFFFF]"
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Véhicules ({vehicles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("leads")}
            className={`py-3 px-3 text-[13px] font-medium border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "leads"
                ? "border-[#C62828] text-[#FFFFFF] font-bold"
                : "border-transparent text-[#8A8A8A] hover:text-[#FFFFFF]"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>CRM Prospects</span>
            {newLeadsCount > 0 && (
              <span className="px-1.5 py-0.2 bg-[#C62828] text-[#FFFFFF] text-[10px] rounded-full font-bold">
                {newLeadsCount} new
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("customers")}
            className={`py-3 px-3 text-[13px] font-medium border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "customers"
                ? "border-[#C62828] text-[#FFFFFF] font-bold"
                : "border-transparent text-[#8A8A8A] hover:text-[#FFFFFF]"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Clients ({customers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("appointments")}
            className={`py-3 px-3 text-[13px] font-medium border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "appointments"
                ? "border-[#C62828] text-[#FFFFFF] font-bold"
                : "border-transparent text-[#8A8A8A] hover:text-[#FFFFFF]"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Rendez-vous ({appointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`py-3 px-3 text-[13px] font-medium border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "reviews"
                ? "border-[#C62828] text-[#FFFFFF] font-bold"
                : "border-transparent text-[#8A8A8A] hover:text-[#FFFFFF]"
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Avis ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`py-3 px-3 text-[13px] font-medium border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "analytics"
                ? "border-[#C62828] text-[#FFFFFF] font-bold"
                : "border-transparent text-[#8A8A8A] hover:text-[#FFFFFF]"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Analytique</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`py-3 px-3 text-[13px] font-medium border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "settings"
                ? "border-[#C62828] text-[#FFFFFF] font-bold"
                : "border-transparent text-[#8A8A8A] hover:text-[#FFFFFF]"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Paramètres</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#FFFFFF]">

          {/* TAB 1: OVERVIEW & KPIS */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg text-[#151515]">
                  Tableau de bord opérationnel &bull; TITAN CAR
                </h3>
                <p className="text-[13px] text-[#666666]">
                  Aperçu en temps réel de la performance commerciale et de l&apos;inventaire.
                </p>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="titan-card p-4 bg-[#F5F5F2] border border-[#D9D9D4]">
                  <div className="text-[11px] font-bold uppercase text-[#666666] mb-1">
                    Valeur du stock
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-[#151515]">
                    {formatPrice(totalInventoryValue)}
                  </div>
                  <div className="text-[11px] text-[#666666] mt-1">
                    {totalStockCount} véhicules répertoriés
                  </div>
                </div>

                <div className="titan-card p-4 bg-[#F5F5F2] border border-[#D9D9D4]">
                  <div className="text-[11px] font-bold uppercase text-[#666666] mb-1">
                    Stock disponible
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-[#1E6B30]">
                    {availableStockCount} unités
                  </div>
                  <div className="text-[11px] text-[#666666] mt-1">
                    {reservedStockCount} réservés &bull; {soldStockCount} vendus
                  </div>
                </div>

                <div className="titan-card p-4 bg-[#111111] border border-[#303030]">
                  <div className="text-[11px] font-bold uppercase text-[#8A8A8A] mb-1">
                    Prospects actifs
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-[#C62828]">
                    {totalLeadsCount} demandes
                  </div>
                  <div className="text-[11px] text-[#8A8A8A] mt-1">
                    {newLeadsCount} à traiter
                  </div>
                </div>

                <div className="titan-card p-4 bg-[#F5F5F2] border border-[#D9D9D4]">
                  <div className="text-[11px] font-bold uppercase text-[#666666] mb-1">
                    Rendez-vous
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-[#151515]">
                    {activeAppointmentsCount} visites
                  </div>
                  <div className="text-[11px] text-[#666666] mt-1">
                    Showroom Khemis Miliana
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recent Leads */}
                <div className="titan-card p-4 space-y-3 bg-[#FFFFFF] border border-[#D9D9D4]">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[14px] text-[#151515]">
                      Dernières demandes prospects
                    </h4>
                    <button
                      onClick={() => setActiveTab("leads")}
                      className="text-[12px] text-[#C62828] hover:underline cursor-pointer"
                    >
                      Voir tout ({leads.length})
                    </button>
                  </div>

                  <div className="space-y-2">
                    {leads.slice(0, 3).map((lead) => (
                      <div
                        key={lead.id}
                        className="p-2.5 bg-[#F5F5F2] rounded-[8px] flex items-center justify-between text-[12px]"
                      >
                        <div>
                          <div className="font-bold text-[#151515]">{lead.fullName}</div>
                          <div className="text-[#666666] truncate max-w-[200px]">
                            {lead.vehicleTitle || lead.inquiryType}
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-[#FFFFFF] border border-[#D9D9D4] rounded font-semibold text-[11px]">
                          {lead.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Showroom Status & Shortcuts */}
                <div className="titan-card p-4 space-y-3 bg-[#FFFFFF] border border-[#D9D9D4]">
                  <h4 className="font-bold text-[14px] text-[#151515]">
                    Actions rapides concession
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        handleOpenAddVehicle();
                        setActiveTab("vehicles");
                      }}
                      className="p-3 bg-[#111111] hover:bg-[#222222] border border-[#303030] rounded-[6px] text-left transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#C62828] mb-1" />
                      <div className="font-semibold text-[12px] text-[#FFFFFF]">Ajouter véhicule</div>
                      <div className="text-[10px] text-[#8A8A8A]">Entrée nouveau stock</div>
                    </button>

                    <button
                      onClick={() => setActiveTab("appointments")}
                      className="p-3 bg-[#111111] hover:bg-[#222222] border border-[#303030] rounded-[6px] text-left transition-colors cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-[#C62828] mb-1" />
                      <div className="font-semibold text-[12px] text-[#FFFFFF]">Planning RDV</div>
                      <div className="text-[10px] text-[#8A8A8A]">Visites showroom</div>
                    </button>

                    <button
                      onClick={() => setActiveTab("customers")}
                      className="p-3 bg-[#111111] hover:bg-[#222222] border border-[#303030] rounded-[6px] text-left transition-colors cursor-pointer"
                    >
                      <Users className="w-4 h-4 text-[#C62828] mb-1" />
                      <div className="font-semibold text-[12px] text-[#FFFFFF]">Base clients</div>
                      <div className="text-[10px] text-[#8A8A8A]">{customers.length} contacts</div>
                    </button>

                    <button
                      onClick={() => setActiveTab("settings")}
                      className="p-3 bg-[#111111] hover:bg-[#222222] border border-[#303030] rounded-[6px] text-left transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-[#C62828] mb-1" />
                      <div className="font-semibold text-[12px] text-[#FFFFFF]">Coordonnées</div>
                      <div className="text-[10px] text-[#8A8A8A]">WhatsApp &amp; téléphone</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VEHICLES MANAGEMENT */}
          {activeTab === "vehicles" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#151515]">
                    Gestion du stock de véhicules ({vehicles.length})
                  </h3>
                  <p className="text-[13px] text-[#666666]">
                    Ajoutez, modifiez et contrôlez la disponibilité des véhicules exposés.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddVehicle}
                  className="h-9 px-3.5 bg-[#C62828] hover:bg-[#A91F1F] text-[#FFFFFF] font-medium text-[13px] rounded-[6px] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showVehicleForm ? "Fermer" : "Nouveau véhicule"}</span>
                </button>
              </div>

              {/* Add / Edit Form Modal / Collapse */}
              {showVehicleForm && (
                <form
                  onSubmit={handleSaveVehicle}
                  className="titan-card p-4 sm:p-5 space-y-4 bg-[#F5F5F2] border border-[#D9D9D4] animate-fade-in"
                >
                  <div className="flex items-center justify-between border-b border-[#D9D9D4] pb-2">
                    <div className="font-bold text-[14px] text-[#151515]">
                      {isEditingVehicle ? "Modification de la fiche véhicule" : "Ajout d'un nouveau véhicule en stock"}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowVehicleForm(false)}
                      className="text-[#666666] hover:text-[#151515] text-[12px]"
                    >
                      Annuler
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#666666] uppercase mb-1">Marque *</label>
                      <input
                        type="text"
                        required
                        value={vehBrand}
                        onChange={(e) => setVehBrand(e.target.value)}
                        placeholder="Ex : Volkswagen, Hyundai"
                        className="w-full h-9 px-3 bg-[#FFFFFF] border border-[#D9D9D4] rounded-[8px] text-[13px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#666666] uppercase mb-1">Modèle *</label>
                      <input
                        type="text"
                        required
                        value={vehModel}
                        onChange={(e) => setVehModel(e.target.value)}
                        placeholder="Ex : Golf 8, Tucson"
                        className="w-full h-9 px-3 bg-[#FFFFFF] border border-[#D9D9D4] rounded-[8px] text-[13px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#666666] uppercase mb-1">Finition / Version</label>
                      <input
                        type="text"
                        value={vehVersion}
                        onChange={(e) => setVehVersion(e.target.value)}
                        placeholder="Ex : R-Line, N-Line, GT"
                        className="w-full h-9 px-3 bg-[#FFFFFF] border border-[#D9D9D4] rounded-[8px] text-[13px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#666666] uppercase mb-1">Année</label>
                      <input
                        type="number"
                        value={vehYear}
                        onChange={(e) => setVehYear(parseInt(e.target.value, 10))}
                        className="w-full h-9 px-3 bg-[#FFFFFF] border border-[#D9D9D4] rounded-[8px] text-[13px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#666666] uppercase mb-1">Kilométrage (km)</label>
                      <input
                        type="number"
                        value={vehMileage}
                        onChange={(e) => setVehMileage(parseInt(e.target.value, 10))}
                        className="w-full h-9 px-3 bg-[#FFFFFF] border border-[#D9D9D4] rounded-[8px] text-[13px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#666666] uppercase mb-1">Prix (DA, 0 = Sur demande)</label>
                      <input
                        type="number"
                        value={vehPrice || ""}
                        onChange={(e) => setVehPrice(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                        placeholder="Ex : 4500000"
                        className="w-full h-9 px-3 bg-[#FFFFFF] border border-[#D9D9D4] rounded-[8px] text-[13px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#666666] uppercase mb-1">Statut initial</label>
                      <select
                        value={vehStatus}
                        onChange={(e) => setVehStatus(e.target.value as VehicleStatus)}
                        className="w-full h-9 px-3 bg-[#FFFFFF] border border-[#D9D9D4] rounded-[8px] text-[13px]"
                      >
                        <option value="AVAILABLE">Disponible</option>
                        <option value="RESERVED">Réservé</option>
                        <option value="SOLD">Vendu</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#666666] uppercase mb-1">Carburant</label>
                      <select
                        value={vehFuel}
                        onChange={(e) => setVehFuel(e.target.value)}
                        className="w-full h-9 px-3 bg-[#FFFFFF] border border-[#D9D9D4] rounded-[8px] text-[13px]"
                      >
                        <option value="Diesel">Diesel</option>
                        <option value="Essence">Essence</option>
                        <option value="Hybride">Hybride</option>
                        <option value="Électrique">Électrique</option>
                        <option value="GPL">GPL</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#666666] uppercase mb-1">Boîte de vitesses</label>
                      <select
                        value={vehTrans}
                        onChange={(e) => setVehTrans(e.target.value)}
                        className="w-full h-9 px-3 bg-[#FFFFFF] border border-[#D9D9D4] rounded-[8px] text-[13px]"
                      >
                        <option value="Automatique">Automatique</option>
                        <option value="Manuelle">Manuelle</option>
                        <option value="Séquentielle">Séquentielle</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#666666] uppercase mb-1">Carrosserie</label>
                      <select
                        value={vehBodyType}
                        onChange={(e) => setVehBodyType(e.target.value)}
                        className="w-full h-9 px-3 bg-[#FFFFFF] border border-[#D9D9D4] rounded-[8px] text-[13px]"
                      >
                        <option value="Berline">Berline</option>
                        <option value="SUV / 4x4">SUV / 4x4</option>
                        <option value="Citadine">Citadine</option>
                        <option value="Coupé">Coupé</option>
                        <option value="Pick-up">Pick-up</option>
                        <option value="Utilitaire">Utilitaire</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#666666] uppercase mb-1">URL Photo principale</label>
                    <input
                      type="url"
                      value={vehImage}
                      onChange={(e) => setVehImage(e.target.value)}
                      className="w-full h-9 px-3 bg-[#FFFFFF] border border-[#D9D9D4] rounded-[8px] text-[13px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#666666] uppercase mb-1">Équipements & Options (séparés par virgule)</label>
                    <input
                      type="text"
                      value={vehFeatures}
                      onChange={(e) => setVehFeatures(e.target.value)}
                      className="w-full h-9 px-3 bg-[#FFFFFF] border border-[#D9D9D4] rounded-[8px] text-[13px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#666666] uppercase mb-1">Description commerciale</label>
                    <textarea
                      rows={2}
                      value={vehDesc}
                      onChange={(e) => setVehDesc(e.target.value)}
                      placeholder="Véhicule en parfait état, carnet d'entretien à jour..."
                      className="w-full p-2.5 bg-[#FFFFFF] border border-[#D9D9D4] rounded-[8px] text-[13px]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#D9D9D4]">
                    <label className="flex items-center gap-2 text-[13px] font-medium text-[#151515] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={vehFeatured}
                        onChange={(e) => setVehFeatured(e.target.checked)}
                        className="rounded"
                      />
                      <span>Mettre en avant sur la page d&apos;accueil (Featured)</span>
                    </label>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowVehicleForm(false)}
                        className="h-9 px-3 bg-[#FFFFFF] border border-[#D9D9D4] text-[#151515] rounded-[8px] text-[13px]"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="h-9 px-4 bg-[#151515] hover:bg-[#2A2A2A] text-[#FFFFFF] font-medium rounded-[8px] text-[13px]"
                      >
                        {isEditingVehicle ? "Mettre à jour la fiche" : "Enregistrer le véhicule"}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Vehicles List Table */}
              <div className="space-y-2.5">
                {vehicles.map((v) => (
                  <div
                    key={v.id}
                    className="titan-card p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#FFFFFF] border border-[#D9D9D4]"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[14px] text-[#151515]">
                          {v.brand} {v.model} {v.version ? `- ${v.version}` : ""}
                        </span>
                        <span className="text-[12px] text-[#666666]">({v.year})</span>
                        {v.featured && (
                          <span className="px-1.5 py-0.5 bg-[#C62828]/15 text-[#C62828] text-[10px] font-bold rounded">
                            Vedette
                          </span>
                        )}
                      </div>
                      <div className="text-[12px] text-[#666666] flex flex-wrap items-center gap-x-2.5 gap-y-1">
                        <span className="font-semibold text-[#151515]">{formatPrice(v.price)}</span>
                        <span>&bull;</span>
                        <span>{formatMileage(v.mileage)}</span>
                        <span>&bull;</span>
                        <span>{v.fuelType}</span>
                        <span>&bull;</span>
                        <span>{v.transmission}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={v.status}
                        onChange={(e) => updateVehicleStatus(v.id, e.target.value as VehicleStatus)}
                        className={`h-8 px-2.5 rounded-[8px] text-[12px] font-semibold border ${
                          v.status === "AVAILABLE"
                            ? "bg-[#E7F6EA] text-[#1E6B30] border-[#BDE8C5]"
                            : v.status === "RESERVED"
                            ? "bg-[#FFF4E5] text-[#8C5200] border-[#FDE0B2]"
                            : "bg-[#F5F5F2] text-[#666666] border-[#D9D9D4]"
                        }`}
                      >
                        <option value="AVAILABLE">Disponible</option>
                        <option value="RESERVED">Réservé</option>
                        <option value="SOLD">Vendu</option>
                      </select>

                      <button
                        onClick={() => handleOpenEditVehicle(v)}
                        className="w-8 h-8 flex items-center justify-center text-[#666666] hover:text-[#151515] hover:bg-[#F5F5F2] border border-[#D9D9D4] rounded-[8px] transition-colors cursor-pointer"
                        title="Modifier la fiche"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Supprimer définitivement ${v.brand} ${v.model} du stock ?`)) {
                            deleteVehicle(v.id);
                          }
                        }}
                        className="w-8 h-8 flex items-center justify-center text-[#999999] hover:text-[#E22E2E] hover:bg-[#FDEBEB] border border-[#D9D9D4] rounded-[8px] transition-colors cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: LEADS CRM */}
          {activeTab === "leads" && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-base text-[#151515]">
                  CRM &amp; Suivi des Prospects ({leads.length})
                </h3>
                <p className="text-[13px] text-[#666666]">
                  Cycle de qualification des prospects, historique des échanges et conversion.
                </p>
              </div>

              {/* Filters bar */}
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, téléphone, véhicule..."
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    className="w-full h-9 pl-8 pr-3 bg-[#F5F5F2] border border-[#D9D9D4] rounded-[8px] text-[12px]"
                  />
                </div>

                <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
                  {["ALL", "NEW", "CONTACTED", "QUALIFIED", "VISIT_SCHEDULED", "NEGOTIATION", "SOLD", "LOST"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setLeadStatusFilter(st)}
                      className={`h-8 px-2.5 text-[11px] font-semibold rounded-[8px] border transition-colors cursor-pointer whitespace-nowrap ${
                        leadStatusFilter === st
                          ? "bg-[#151515] text-[#FFFFFF] border-[#151515]"
                          : "bg-[#FFFFFF] text-[#666666] border-[#D9D9D4] hover:text-[#151515]"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Leads CRM Split View */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[400px]">
                {/* Leads List column */}
                <div className="space-y-2 overflow-y-auto max-h-[500px] pr-1">
                  {filteredLeads.length === 0 ? (
                    <div className="p-4 text-center text-[#666666] text-[13px] titan-card">
                      Aucun prospect trouvé.
                    </div>
                  ) : (
                    filteredLeads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLeadId(lead.id)}
                        className={`titan-card p-3 cursor-pointer transition-colors border ${
                          selectedLead?.id === lead.id
                            ? "border-[#C62828] bg-[#C62828]/10"
                            : "border-[#303030] bg-[#111111] hover:bg-[#222222]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div className="font-bold text-[13px] text-[#151515]">{lead.fullName}</div>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F5F5F2] border border-[#D9D9D4] font-semibold">
                            {lead.status}
                          </span>
                        </div>

                        <div className="text-[11px] text-[#666666] mt-0.5">📞 {lead.phone}</div>
                        {lead.vehicleTitle && (
                          <div className="text-[11px] text-[#C62828] truncate mt-1">
                            {lead.vehicleTitle}
                          </div>
                        )}
                        <div className="text-[10px] text-[#999999] mt-1 text-right">
                          {new Date(lead.createdAt).toLocaleDateString("fr-FR")}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Lead Detail & Timeline column */}
                <div className="md:col-span-2 titan-card p-4 sm:p-5 bg-[#F5F5F2] border border-[#D9D9D4] flex flex-col justify-between">
                  {selectedLead ? (
                    <div className="space-y-4">
                      {/* Top bar of selected lead */}
                      <div className="flex items-start justify-between border-b border-[#D9D9D4] pb-3">
                        <div>
                          <div className="font-bold text-base text-[#151515]">{selectedLead.fullName}</div>
                          <div className="text-[12px] text-[#666666] flex flex-wrap gap-3 mt-1">
                            <span>📞 {selectedLead.phone}</span>
                            {selectedLead.email && <span>✉️ {selectedLead.email}</span>}
                            <span>Canal : {selectedLead.preferredContact}</span>
                          </div>
                        </div>

                        {/* Status Select & Convert */}
                        <div className="flex items-center gap-2">
                          <select
                            value={selectedLead.status}
                            onChange={(e) => updateLeadStatus(selectedLead.id, e.target.value as LeadStatus)}
                            className="h-8 px-2.5 bg-[#FFFFFF] border border-[#D9D9D4] rounded-[8px] text-[12px] font-bold text-[#151515]"
                          >
                            <option value="NEW">NOUVEAU (NEW)</option>
                            <option value="CONTACTED">CONTACTÉ</option>
                            <option value="QUALIFIED">QUALIFIÉ</option>
                            <option value="VISIT_SCHEDULED">VISITE PLANIFIÉE</option>
                            <option value="NEGOTIATION">NÉGOCIATION</option>
                            <option value="SOLD">VENDU (SOLD)</option>
                            <option value="LOST">PERDU (LOST)</option>
                          </select>

                          <button
                            onClick={() => convertLeadToCustomer(selectedLead.id)}
                            className="h-8 px-2.5 bg-[#151515] hover:bg-[#2A2A2A] text-[#FFFFFF] text-[11px] font-medium rounded-[8px] transition-colors cursor-pointer"
                            title="Convertir en client acheteur"
                          >
                            Convertir en Client
                          </button>
                        </div>
                      </div>

                      {/* Direct WhatsApp / Call buttons */}
                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Bonjour ${selectedLead.fullName}, ici la concession TITAN CAR à Khemis Miliana concernant votre demande pour le véhicule.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="h-8 px-3 bg-[#E7F6EA] text-[#1E6B30] border border-[#BDE8C5] rounded-[8px] text-[12px] font-semibold flex items-center gap-1.5 hover:bg-[#D5F0DA]"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Répondre par WhatsApp</span>
                        </a>

                        <a
                          href={`tel:${selectedLead.phone}`}
                          className="h-8 px-3 bg-[#FFFFFF] text-[#151515] border border-[#D9D9D4] rounded-[8px] text-[12px] font-semibold flex items-center gap-1.5 hover:bg-[#F5F5F2]"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Appeler</span>
                        </a>
                      </div>

                      {/* Initial message */}
                      <div className="bg-[#FFFFFF] border border-[#D9D9D4] p-3 rounded-[8px] space-y-1">
                        <div className="text-[11px] font-bold text-[#666666] uppercase">Message initial du prospect :</div>
                        <p className="text-[13px] text-[#151515] italic">&quot;{selectedLead.message}&quot;</p>
                        {selectedLead.vehicleTitle && (
                          <div className="text-[12px] text-[#C62828] font-medium pt-1">
                            Véhicule rattaché : {selectedLead.vehicleTitle}
                          </div>
                        )}
                      </div>

                      {/* Timeline Notes */}
                      <div className="space-y-2">
                        <div className="text-[12px] font-bold text-[#151515]">Historique &amp; Notes internes :</div>
                        <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
                          {(selectedLead.notes || []).length === 0 ? (
                            <div className="text-[12px] text-[#666666] italic">Aucune note enregistrée.</div>
                          ) : (
                            selectedLead.notes?.map((n) => (
                              <div key={n.id} className="p-2 bg-[#FFFFFF] border border-[#D9D9D4] rounded-[6px] text-[12px]">
                                <div className="flex items-center justify-between text-[10px] text-[#666666] mb-0.5">
                                  <span className="font-bold text-[#151515]">{n.author}</span>
                                  <span>{new Date(n.createdAt).toLocaleString("fr-FR")}</span>
                                </div>
                                <p className="text-[#151515]">{n.text}</p>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Add Note Input */}
                        <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
                          <input
                            type="text"
                            placeholder="Ajouter une note de suivi (ex : Offre transmise à 4.2M DA)..."
                            value={newLeadNoteText}
                            onChange={(e) => setNewLeadNoteText(e.target.value)}
                            className="flex-1 h-8 px-2.5 bg-[#FFFFFF] border border-[#D9D9D4] rounded-[8px] text-[12px]"
                          />
                          <button
                            type="submit"
                            className="h-8 px-3 bg-[#C62828] hover:bg-[#A91F1F] text-[#FFFFFF] text-[12px] font-medium rounded-[6px] cursor-pointer"
                          >
                            Ajouter
                          </button>
                        </form>
                      </div>
                    </div>
                  ) : (
                    <div className="m-auto text-center text-[#666666] text-[13px]">
                      Sélectionnez un prospect dans la liste pour afficher ses détails.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMERS DIRECTORY */}
          {activeTab === "customers" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#151515]">
                    Répertoire Clients &amp; Acheteurs ({customers.length})
                  </h3>
                  <p className="text-[13px] text-[#666666]">
                    Annuaire des clients enregistrés et historique de relation commerciale.
                  </p>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, téléphone, email..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full h-9 pl-8 pr-3 bg-[#F5F5F2] border border-[#D9D9D4] rounded-[8px] text-[12px]"
                />
              </div>

              {/* Customer table */}
              <div className="space-y-2.5">
                {filteredCustomers.map((cust) => (
                  <div
                    key={cust.id}
                    className="titan-card p-3.5 bg-[#FFFFFF] border border-[#D9D9D4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[14px] text-[#151515]">{cust.fullName}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            cust.status === "CUSTOMER"
                              ? "bg-[#E7F6EA] text-[#1E6B30]"
                              : "bg-[#F5F5F2] text-[#666666]"
                          }`}
                        >
                          {cust.status === "CUSTOMER" ? "Client Acheteur" : "Prospect"}
                        </span>
                      </div>
                      <div className="text-[12px] text-[#666666] flex flex-wrap items-center gap-3">
                        <span>📞 {cust.phone}</span>
                        {cust.email && <span>✉️ {cust.email}</span>}
                        <span>&bull; {cust.totalInquiries} demande(s)</span>
                      </div>
                      {cust.notes && <p className="text-[11px] text-[#666666] italic">{cust.notes}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${cust.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="h-8 px-2.5 bg-[#E7F6EA] text-[#1E6B30] border border-[#BDE8C5] rounded-[8px] text-[11px] font-semibold flex items-center gap-1 hover:bg-[#D5F0DA]"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>

                      <button
                        onClick={() => {
                          if (confirm(`Supprimer ${cust.fullName} du répertoire ?`)) {
                            deleteCustomer(cust.id);
                          }
                        }}
                        className="w-8 h-8 flex items-center justify-center text-[#999999] hover:text-[#E22E2E] border border-[#D9D9D4] rounded-[8px] transition-colors cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: APPOINTMENTS */}
          {activeTab === "appointments" && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-base text-[#151515]">
                  Planning des visites &amp; essais Showroom ({appointments.length})
                </h3>
                <p className="text-[13px] text-[#666666]">
                  Gestion des rendez-vous showroom à Khemis Miliana.
                </p>
              </div>

              <div className="space-y-3">
                {appointments.length === 0 ? (
                  <div className="titan-card p-8 text-center text-[#666666] text-[13px]">
                    Aucun rendez-vous planifié pour le moment.
                  </div>
                ) : (
                  appointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="titan-card p-4 bg-[#FFFFFF] border border-[#D9D9D4] space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-[15px] text-[#151515]">{apt.customerName}</div>
                          <div className="text-[13px] text-[#666666] flex flex-wrap gap-x-3 gap-y-1">
                            <span>📞 {apt.phone}</span>
                            <span>📅 <strong>{apt.date}</strong> à <strong>{apt.timeSlot}</strong></span>
                            <span>Type : <strong>{apt.type}</strong></span>
                          </div>
                        </div>

                        <select
                          value={apt.status}
                          onChange={(e) => updateAppointmentStatus(apt.id, e.target.value as AppointmentStatus)}
                          className={`h-8 px-2.5 rounded-[8px] text-[12px] font-bold border ${
                            apt.status === "CONFIRMED"
                              ? "bg-[#E7F6EA] text-[#1E6B30] border-[#BDE8C5]"
                              : apt.status === "REQUESTED"
                              ? "bg-[#FFF4E5] text-[#8C5200] border-[#FDE0B2]"
                              : "bg-[#F5F5F2] text-[#666666] border-[#D9D9D4]"
                          }`}
                        >
                          <option value="REQUESTED">EN ATTENTE (REQUESTED)</option>
                          <option value="CONFIRMED">CONFIRMÉ (CONFIRMED)</option>
                          <option value="COMPLETED">TERMINÉ (COMPLETED)</option>
                          <option value="CANCELLED">ANNULÉ (CANCELLED)</option>
                        </select>
                      </div>

                      {apt.vehicleTitle && (
                        <div className="text-[12px] bg-[#F5F5F2] p-2 rounded-[8px] text-[#151515]">
                          Véhicule prévu pour l&apos;essai : <strong>{apt.vehicleTitle}</strong>
                        </div>
                      )}

                      {apt.notes && (
                        <div className="text-[12px] text-[#666666] italic">
                          Notes client : &quot;{apt.notes}&quot;
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-[#F5F5F2] text-[11px] text-[#666666]">
                        <a
                          href={`https://wa.me/${apt.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Bonjour ${apt.customerName}, confirmation de votre rendez-vous chez TITAN CAR le ${apt.date} à ${apt.timeSlot}.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#1E6B30] font-semibold hover:underline flex items-center gap-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Confirmer par WhatsApp</span>
                        </a>

                        <button
                          onClick={() => {
                            if (confirm("Supprimer ce rendez-vous ?")) {
                              deleteAppointment(apt.id);
                            }
                          }}
                          className="text-[#999999] hover:text-[#E22E2E]"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 6: REVIEWS CMS */}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-base text-[#151515]">
                  Gestion des avis clients Google ({reviews.length})
                </h3>
                <p className="text-[13px] text-[#666666]">
                  Avis vérifiés affichés sur le site public de TITAN CAR.
                </p>
              </div>

              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="titan-card p-4 bg-[#FFFFFF] border border-[#D9D9D4] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[14px] text-[#151515]">{rev.authorName}</span>
                        <div className="flex text-[#C62828]">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-[#C62828]" />
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm("Supprimer cet avis ?")) deleteReview(rev.id);
                        }}
                        className="text-[#999999] hover:text-[#E22E2E] text-[12px]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[13px] text-[#151515] italic">&quot;{rev.comment}&quot;</p>
                    {rev.vehicleModel && (
                      <div className="text-[11px] text-[#666666]">Véhicule : {rev.vehicleModel} &bull; Date : {rev.date}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: ANALYTICS & EVENTS */}
          {activeTab === "analytics" && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-base text-[#151515]">
                  Journal d&apos;activité &amp; Télémétrie d&apos;audience
                </h3>
                <p className="text-[13px] text-[#666666]">
                  Statistiques d&apos;interactions et d&apos;événements de conversion enregistrés.
                </p>
              </div>

              {/* Event stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#F5F5F2] rounded-[8px] border border-[#D9D9D4]">
                  <div className="text-[11px] font-bold text-[#666666] uppercase">Vues de fiches</div>
                  <div className="text-xl font-bold text-[#151515]">
                    {analyticsEvents.filter((e) => e.type === "vehicle_view").length + 24}
                  </div>
                </div>

                <div className="p-3 bg-[#111111] rounded-[6px] border border-[#303030]">
                  <div className="text-[11px] font-bold text-[#8A8A8A] uppercase">Formulaires leads</div>
                  <div className="text-xl font-bold text-[#C62828]">
                    {leads.length}
                  </div>
                </div>

                <div className="p-3 bg-[#F5F5F2] rounded-[8px] border border-[#D9D9D4]">
                  <div className="text-[11px] font-bold text-[#666666] uppercase">Demandes RDV</div>
                  <div className="text-xl font-bold text-[#1E6B30]">
                    {appointments.length}
                  </div>
                </div>

                <div className="p-3 bg-[#F5F5F2] rounded-[8px] border border-[#D9D9D4]">
                  <div className="text-[11px] font-bold text-[#666666] uppercase">Conseiller IA</div>
                  <div className="text-xl font-bold text-[#151515]">
                    {analyticsEvents.filter((e) => e.type === "ai_assistant_query").length + 12}
                  </div>
                </div>
              </div>

              {/* Raw Events Stream */}
              <div className="titan-card p-4 space-y-2 bg-[#FFFFFF] border border-[#D9D9D4]">
                <div className="font-bold text-[13px] text-[#151515]">Derniers événements captés :</div>
                <div className="space-y-1.5 max-h-[250px] overflow-y-auto font-mono text-[11px]">
                  {analyticsEvents.length === 0 ? (
                    <div className="text-[#666666] py-2">Les événements de session apparaîtront ici.</div>
                  ) : (
                    analyticsEvents.slice(0, 15).map((evt) => (
                      <div key={evt.id} className="p-2 bg-[#F5F5F2] rounded flex items-center justify-between">
                        <span className="font-semibold text-[#151515]">{evt.type}</span>
                        <span className="text-[#666666]">{evt.source || "web"}</span>
                        <span className="text-[#999999]">{new Date(evt.timestamp).toLocaleTimeString("fr-FR")}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SETTINGS */}
          {activeTab === "settings" && (
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <h3 className="font-bold text-base text-[#151515]">
                  Paramètres de contact &bull; TITAN CAR
                </h3>
                <p className="text-[13px] text-[#666666]">
                  Configurez les coordonnées officielles dès qu&apos;elles sont validées (règle d&apos;intégrité des données).
                </p>
              </div>

              <div className="space-y-3 titan-card p-4 bg-[#FFFFFF] border border-[#D9D9D4]">
                <div>
                  <label className="block text-[12px] font-semibold text-[#151515] mb-1">
                    Numéro de téléphone officiel
                  </label>
                  <input
                    type="tel"
                    value={phoneVal}
                    onChange={(e) => setPhoneVal(e.target.value)}
                    placeholder="Non renseigné (ex: +213 550 00 00 00)"
                    className="w-full h-9 px-3 bg-[#FFFFFF] border border-[#D9D9D4] rounded-[8px] text-[13px]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[#151515] mb-1">
                    Numéro WhatsApp officiel
                  </label>
                  <input
                    type="tel"
                    value={whatsappVal}
                    onChange={(e) => setWhatsappVal(e.target.value)}
                    placeholder="Non renseigné (ex: +213 550 00 00 00)"
                    className="w-full h-9 px-3 bg-[#FFFFFF] border border-[#D9D9D4] rounded-[8px] text-[13px]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[#151515] mb-1">
                    Email officiel
                  </label>
                  <input
                    type="email"
                    value={emailVal}
                    onChange={(e) => setEmailVal(e.target.value)}
                    placeholder="Non renseigné (ex: contact@titancar.dz)"
                    className="w-full h-9 px-3 bg-[#FFFFFF] border border-[#D9D9D4] rounded-[8px] text-[13px]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[#151515] mb-1">
                    Adresse physique showroom
                  </label>
                  <input
                    type="text"
                    value={addressVal}
                    onChange={(e) => setAddressVal(e.target.value)}
                    placeholder="Khemis Miliana, Wilaya d'Aïn Defla, Algérie"
                    className="w-full h-9 px-3 bg-[#FFFFFF] border border-[#D9D9D4] rounded-[8px] text-[13px]"
                  />
                </div>
              </div>

              {savedSettingsSuccess && (
                <div className="p-3 bg-[#E7F6EA] text-[#1E6B30] border border-[#BDE8C5] rounded-[8px] text-[13px] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Paramètres mis à jour avec succès.</span>
                </div>
              )}

              <button
                type="submit"
                className="h-10 px-5 bg-[#C62828] hover:bg-[#A91F1F] text-[#FFFFFF] font-medium text-[13px] rounded-[6px] flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer les coordonnées</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
