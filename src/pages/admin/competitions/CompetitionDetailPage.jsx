import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Pencil, Trash2, Plus, MapPin, Calendar, Users,
  Download, Trophy, Award, Target, ListFilter, Star,
} from "lucide-react";
import { useI18n } from "../../../i18n/I18nContext";
import { competitionsApi, studentsApi } from "../../../api";
import { useToast } from "../../../context/ToastContext";
import { useConfirm } from "../../../context/ConfirmContext";
import { exportToCSV, AGE_CATEGORIES } from "../../../utils/helpers";

import Badge, { CompetitionStatusBadge } from "../../../components/admin/common/Badge";
import Tabs from "../../../components/admin/common/Tabs";
import Card from "../../../components/admin/common/Card";
import Button from "../../../components/admin/common/Button";
import EmptyState from "../../../components/admin/common/EmptyState";
import Avatar from "../../../components/admin/common/Avatar";
import { Select } from "../../../components/admin/common/FormFields";
import StatCard from "../../../components/admin/common/StatCard";

import CompetitionFormModal from "./CompetitionFormModal";
import TrackFormModal from "./TrackFormModal";
import RegisterStudentModal from "./RegisterStudentModal";

export default function CompetitionDetailPage() {
  const { competitionId } = useParams();
  const { t, isRtl, formatDate, formatNumber } = useI18n();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState(null);
  const [trackSaving, setTrackSaving] = useState(false);

  const [registerOpen, setRegisterOpen] = useState(false);
  const [registerSaving, setRegisterSaving] = useState(false);
  const [allStudents, setAllStudents] = useState([]);

  const [registrations, setRegistrations] = useState([]);
  const [regLoading, setRegLoading] = useState(false);
  const [trackFilter, setTrackFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState("all");

  const [results, setResults] = useState(null);
  const [resultsLoading, setResultsLoading] = useState(false);

  const loadCompetition = useCallback(() => {
    return competitionsApi.getCompetition(competitionId).then((res) => setCompetition(res.data));
  }, [competitionId]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    loadCompetition().finally(() => mounted && setLoading(false));
    studentsApi.listStudents({ pageSize: 200 }).then((res) => mounted && setAllStudents(res.data));
    return () => { mounted = false; };
  }, [loadCompetition]);

  const loadRegistrations = useCallback(() => {
    setRegLoading(true);
    competitionsApi
      .getRegistrations(competitionId, { trackId: trackFilter, ageCategory: ageFilter, pageSize: 100 })
      .then((res) => setRegistrations(res.data))
      .finally(() => setRegLoading(false));
  }, [competitionId, trackFilter, ageFilter]);

  useEffect(() => {
    if (activeTab === "registrations") loadRegistrations();
  }, [activeTab, loadRegistrations]);

  useEffect(() => {
    if (activeTab !== "results") return;
    setResultsLoading(true);
    competitionsApi
      .getResults(competitionId)
      .then((res) => setResults(res.data))
      .finally(() => setResultsLoading(false));
  }, [activeTab, competitionId]);

  const handleEditSubmit = async (form) => {
    setSaving(true);
    try {
      const res = await competitionsApi.updateCompetition(competitionId, form);
      setCompetition(res.data);
      toast.success(t.common.saved);
      setEditOpen(false);
    } catch (err) {
      toast.error(err.message || t.common.somethingWrong);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const ok = await confirm({});
    if (!ok) return;
    try {
      await competitionsApi.deleteCompetition(competitionId);
      toast.success(t.common.deleted);
      navigate("/competitions");
    } catch (err) {
      toast.error(err.message || t.common.somethingWrong);
    }
  };

  const openAddTrack = () => { setEditingTrack(null); setTrackModalOpen(true); };
  const openEditTrack = (track) => { setEditingTrack(track); setTrackModalOpen(true); };

  const handleTrackSubmit = async (form) => {
    setTrackSaving(true);
    try {
      if (editingTrack) {
        await competitionsApi.updateTrack(competitionId, editingTrack.id, form);
      } else {
        await competitionsApi.addTrack(competitionId, form);
      }
      toast.success(t.common.saved);
      setTrackModalOpen(false);
      loadCompetition();
    } catch (err) {
      toast.error(err.message || t.common.somethingWrong);
    } finally {
      setTrackSaving(false);
    }
  };

  const handleDeleteTrack = async (track) => {
    const ok = await confirm({ confirmLabel: t.common.delete });
    if (!ok) return;
    try {
      await competitionsApi.deleteTrack(competitionId, track.id);
      toast.success(t.common.deleted);
      loadCompetition();
    } catch (err) {
      toast.error(err.message || t.common.somethingWrong);
    }
  };

  const handleRegisterStudent = async (form) => {
    setRegisterSaving(true);
    try {
      await competitionsApi.registerStudent(competitionId, form);
      toast.success(t.common.created);
      setRegisterOpen(false);
      loadRegistrations();
    } catch (err) {
      toast.error(err.message || t.common.somethingWrong);
    } finally {
      setRegisterSaving(false);
    }
  };

  const handleExportRegistrations = () => {
    exportToCSV(`${competition?.name || "competition"}-registrations`, registrations, [
      { key: "studentName", label: t.common.name },
      { key: "age", label: t.common.age },
      { key: "trackName", label: t.competitions.trackName },
      { key: "groupName", label: t.groups.groupName },
      { key: "registeredDate", label: t.common.date },
    ]);
    toast.success(t.common.export);
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-fadeIn">
        <div className="h-8 w-40 skeleton-surface animate-shimmer rounded" />
        <div className="h-36 skeleton-surface animate-shimmer rounded-2xl" />
        <div className="h-64 skeleton-surface animate-shimmer rounded-2xl" />
      </div>
    );
  }

  if (!competition) return <EmptyState title={t.common.noResults} body={t.common.noResultsBody} />;

  const tabs = [
    { key: "details", label: t.competitions.tabs.details },
    { key: "tracks", label: `${t.competitions.tabs.tracks} (${competition.tracks.length})` },
    { key: "registrations", label: t.competitions.tabs.registrations },
    { key: "results", label: t.competitions.tabs.results },
  ];

  return (
    <div className="animate-fadeIn">
      <button onClick={() => navigate("/competitions")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-faint hover:text-ink transition mb-4">
        <BackIcon size={15} />
        {t.common.back}
      </button>

      <div className="bg-paper-raised border border-line rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-extrabold text-ink">{competition.name}</h1>
              <CompetitionStatusBadge status={competition.status} t={t} />
            </div>
            <div className="flex items-center gap-4 mt-2.5 flex-wrap text-sm text-ink-faint">
              <span className="flex items-center gap-1.5 nums-ltr">
                <Calendar size={14} /> {formatDate(competition.startDate)} – {formatDate(competition.endDate)}
              </span>
              {competition.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} /> {competition.location}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" icon={Pencil} onClick={() => setEditOpen(true)}>{t.common.edit}</Button>
            <Button variant="dangerGhost" icon={Trash2} onClick={handleDelete}>{t.common.delete}</Button>
          </div>
        </div>
      </div>

      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      <div className="mt-5">
        {activeTab === "details" && (
          <Card title={t.competitions.details}>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div>
                <dt className="text-ink-faint text-[12px] font-medium mb-0.5">{t.common.name}</dt>
                <dd className="font-semibold text-ink">{competition.name}</dd>
              </div>
              <div>
                <dt className="text-ink-faint text-[12px] font-medium mb-0.5">{t.common.status}</dt>
                <dd><CompetitionStatusBadge status={competition.status} t={t} /></dd>
              </div>
              <div>
                <dt className="text-ink-faint text-[12px] font-medium mb-0.5">{t.competitions.startDate}</dt>
                <dd className="font-semibold text-ink nums-ltr">{formatDate(competition.startDate)}</dd>
              </div>
              <div>
                <dt className="text-ink-faint text-[12px] font-medium mb-0.5">{t.competitions.endDate}</dt>
                <dd className="font-semibold text-ink nums-ltr">{formatDate(competition.endDate)}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-ink-faint text-[12px] font-medium mb-0.5">{t.competitions.location}</dt>
                <dd className="font-semibold text-ink">{competition.location || t.common.notProvided}</dd>
              </div>
            </dl>
          </Card>
        )}

        {activeTab === "tracks" && (
          <Card
            title={t.competitions.tracks}
            headerActions={<Button size="sm" icon={Plus} onClick={openAddTrack}>{t.competitions.newTrack}</Button>}
            padding={false}
          >
            {competition.tracks.length === 0 ? (
              <EmptyState compact icon={Target} title={t.competitions.noTracks} actionLabel={t.competitions.newTrack} onAction={openAddTrack} />
            ) : (
              <ul className="divide-y divide-line-soft">
                {competition.tracks.map((track) => (
                  <li key={track.id} className="flex items-center justify-between gap-3 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gold-soft text-gold-dark flex items-center justify-center shrink-0">
                        <Target size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-ink text-sm">{track.name}</p>
                        <p className="text-[12px] text-ink-faint nums-ltr">
                          {track.requiredParts} {t.competitions.requiredParts} · {t.competitions.maxAge}: {track.maxAge}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openEditTrack(track)} className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-faint hover:bg-line-soft hover:text-ink transition">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDeleteTrack(track)} className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-faint hover:bg-rose-soft hover:text-rose transition">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}

        {activeTab === "registrations" && (
          <div>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <ListFilter size={15} className="text-ink-faint shrink-0" />
                <Select value={trackFilter} onChange={(e) => setTrackFilter(e.target.value)} className="max-w-[220px]">
                  <option value="all">{t.competitions.filterByTrack}: {t.common.all}</option>
                  {competition.tracks.map((tr) => (
                    <option key={tr.id} value={tr.id}>{tr.name}</option>
                  ))}
                </Select>
                <Select value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)} className="max-w-[200px]">
                  <option value="all">{t.competitions.filterByAge}: {t.common.all}</option>
                  {AGE_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{isRtl ? c.labelAr : c.labelEn}</option>
                  ))}
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" icon={Download} onClick={handleExportRegistrations}>{t.common.export}</Button>
                <Button icon={Plus} onClick={() => setRegisterOpen(true)} disabled={competition.tracks.length === 0}>
                  {t.competitions.registerStudent}
                </Button>
              </div>
            </div>

            <Card padding={false}>
              {regLoading ? (
                <div className="p-5 space-y-3">
                  {[...Array(4)].map((_, i) => <div key={i} className="h-12 skeleton-surface animate-shimmer rounded-lg" />)}
                </div>
              ) : registrations.length === 0 ? (
                <EmptyState compact icon={Users} title={t.competitions.noRegistrations} actionLabel={t.competitions.registerStudent} onAction={() => setRegisterOpen(true)} />
              ) : (
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-line-soft/60 border-b border-line">
                        <th className="px-4 py-3 text-start text-[11.5px] font-bold text-ink-faint uppercase tracking-wide">{t.common.name}</th>
                        <th className="px-4 py-3 text-start text-[11.5px] font-bold text-ink-faint uppercase tracking-wide">{t.common.age}</th>
                        <th className="px-4 py-3 text-start text-[11.5px] font-bold text-ink-faint uppercase tracking-wide">{t.competitions.trackName}</th>
                        <th className="px-4 py-3 text-start text-[11.5px] font-bold text-ink-faint uppercase tracking-wide">{t.groups.groupName}</th>
                        <th className="px-4 py-3 text-start text-[11.5px] font-bold text-ink-faint uppercase tracking-wide">{t.common.date}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((r) => (
                        <tr key={r.id} className="border-b border-line-soft last:border-0">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <Avatar name={r.studentName} size="sm" />
                              <span className="font-semibold text-ink">{r.studentName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 tabular text-ink-soft">{r.age}</td>
                          <td className="px-4 py-3"><Badge tone="gold">{r.trackName}</Badge></td>
                          <td className="px-4 py-3 text-ink-soft">{r.groupName || "—"}</td>
                          <td className="px-4 py-3 text-ink-faint nums-ltr">{formatDate(r.registeredDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === "results" && (
          <div>
            {resultsLoading ? (
              <div className="grid grid-cols-3 gap-4 mb-5">
                {[...Array(3)].map((_, i) => <StatCard key={i} loading />)}
              </div>
            ) : results && (
              <div className="grid grid-cols-3 gap-4 mb-5">
                <StatCard label={t.competitions.totalParticipants} value={formatNumber(results.stats.totalParticipants)} icon={Users} tone="sky" />
                <StatCard label={t.competitions.avgScore} value={formatNumber(results.stats.avgScore)} icon={Target} tone="gold" />
                <StatCard label={t.competitions.topScore} value={formatNumber(results.stats.topScore)} icon={Trophy} tone="primary" />
              </div>
            )}

            <Card title={t.competitions.results} padding={false}>
              {resultsLoading ? (
                <div className="p-5 space-y-3">
                  {[...Array(4)].map((_, i) => <div key={i} className="h-12 skeleton-surface animate-shimmer rounded-lg" />)}
                </div>
              ) : !results || results.rankings.length === 0 ? (
                <EmptyState compact icon={Award} title={t.competitions.noResults} />
              ) : (
                <ul className="divide-y divide-line-soft">
                  {results.rankings.map((r) => (
                    <li key={r.id} className="flex items-center gap-3 px-5 py-3.5">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm shrink-0 ${
                          r.rank === 1 ? "bg-gold text-white" : r.rank === 2 ? "bg-ink-faint text-white" : r.rank === 3 ? "bg-amber text-white" : "bg-line-soft text-ink-faint"
                        }`}
                      >
                        {r.rank}
                      </div>
                      <Avatar name={r.studentName} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-ink text-sm truncate">{r.studentName}</p>
                        <p className="text-[11.5px] text-ink-faint">{r.trackName}</p>
                      </div>
                      {r.rank <= 3 && <Star size={15} className="text-gold fill-gold shrink-0" />}
                      <span className="font-extrabold text-ink tabular nums-ltr w-12 text-end shrink-0">{r.score}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        )}
      </div>

      <CompetitionFormModal open={editOpen} onClose={() => setEditOpen(false)} onSubmit={handleEditSubmit} initialData={competition} saving={saving} />
      <TrackFormModal open={trackModalOpen} onClose={() => setTrackModalOpen(false)} onSubmit={handleTrackSubmit} initialData={editingTrack} saving={trackSaving} />
      <RegisterStudentModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSubmit={handleRegisterStudent}
        tracks={competition.tracks}
        students={allStudents}
        saving={registerSaving}
      />
    </div>
  );
}
