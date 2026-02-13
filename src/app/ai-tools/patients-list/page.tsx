'use client';

import { useState } from 'react';
import { AIToolsLayout } from '@/components/layout/AIToolsLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Search, Plus, FileText, Pill, User, Filter, MoreVertical } from 'lucide-react';

interface Prescription {
    id: string;
    medicine: string;
    dosage: string;
    frequency: string;
    date: string;
}

interface Patient {
    id: string;
    name: string;
    age: number;
    condition: string;
    lastVisit: string;
    status: 'Stable' | 'Critical' | 'Recovering';
    prescriptions: Prescription[];
}

const MOCK_PATIENTS: Patient[] = [
    {
        id: '1',
        name: 'Sarah Connor',
        age: 45,
        condition: 'Hypertension',
        lastVisit: '2024-02-01',
        status: 'Stable',
        prescriptions: [
            { id: 'p1', medicine: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', date: '2024-02-01' }
        ]
    },
    {
        id: '2',
        name: 'John Wick',
        age: 42,
        condition: 'Orthopedic Injury',
        lastVisit: '2024-01-28',
        status: 'Recovering',
        prescriptions: [
            { id: 'p2', medicine: 'Ibuprofen', dosage: '800mg', frequency: 'As needed', date: '2024-01-28' }
        ]
    },
    {
        id: '3',
        name: 'Bruce Wayne',
        age: 38,
        condition: 'Insomnia',
        lastVisit: '2024-02-05',
        status: 'Stable',
        prescriptions: []
    }
];

export default function PatientsListPage() {
    const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
    const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);

    // New Patient Form State
    const [newPatient, setNewPatient] = useState({ name: '', age: '', condition: '', status: 'Stable' });

    // New Prescription Form State
    const [newPrescription, setNewPrescription] = useState({ medicine: '', dosage: '', frequency: '' });

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.condition.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddPatient = () => {
        if (!newPatient.name) return;

        const patient: Patient = {
            id: Date.now().toString(),
            name: newPatient.name,
            age: parseInt(newPatient.age) || 0,
            condition: newPatient.condition || 'General Checkup',
            lastVisit: new Date().toISOString().split('T')[0],
            status: newPatient.status as Patient['status'],
            prescriptions: []
        };

        setPatients([...patients, patient]);
        setNewPatient({ name: '', age: '', condition: '', status: 'Stable' });
        setIsAddPatientOpen(false);
    };

    const handleAddPrescription = () => {
        if (!selectedPatient || !newPrescription.medicine) return;

        const prescription: Prescription = {
            id: Date.now().toString(),
            medicine: newPrescription.medicine,
            dosage: newPrescription.dosage,
            frequency: newPrescription.frequency,
            date: new Date().toISOString().split('T')[0]
        };

        const updatedPatients = patients.map(p => {
            if (p.id === selectedPatient.id) {
                return { ...p, prescriptions: [prescription, ...p.prescriptions] };
            }
            return p;
        });

        setPatients(updatedPatients);
        setSelectedPatient({ ...selectedPatient, prescriptions: [prescription, ...selectedPatient.prescriptions] });
        setNewPrescription({ medicine: '', dosage: '', frequency: '' });
    };

    return (
        <AIToolsLayout title="Patient Registry">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Patient Registry</h1>
                        <p className="text-zinc-500 text-sm">Manage medical records and prescriptions with AI-assisted workflows.</p>
                    </div>

                    <Button className="rounded-xl h-10 shadow-lg shadow-primary/10" onClick={() => setIsAddPatientOpen(true)}>
                        <Plus size={18} className="mr-2" /> Add New Patient
                    </Button>
                </div>

                {/* Filters & Actions */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or condition..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/40 text-zinc-400 text-sm hover:text-white hover:border-zinc-700 transition-all">
                        <Filter size={16} /> Filters
                    </button>
                </div>

                <div className="grid gap-3">
                    {filteredPatients.map((patient) => (
                        <Card key={patient.id} className="p-4 border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 transition-all flex flex-col md:flex-row items-center justify-between gap-4 group">
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="w-12 h-12 rounded-xl bg-zinc-800/50 border border-zinc-700 flex items-center justify-center text-zinc-400 shrink-0 group-hover:scale-105 transition-transform">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white leading-tight">{patient.name}</h3>
                                    <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                                        <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">{patient.age} yrs</span>
                                        <span>•</span>
                                        <span className="text-zinc-400 font-medium">{patient.condition}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                <div className="text-right hidden sm:block">
                                    <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-0.5 font-bold">Last Visit</div>
                                    <div className="text-sm font-medium text-zinc-300">{patient.lastVisit}</div>
                                </div>

                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${patient.status === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                    patient.status === 'Recovering' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                        'bg-green-500/10 text-green-500 border-green-500/20'
                                    }`}>
                                    {patient.status}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedPatient(patient);
                                            setIsPrescriptionOpen(true);
                                        }}
                                        className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all"
                                        title="View/Add Prescription"
                                    >
                                        <Pill size={18} />
                                    </button>
                                    <button className="p-2.5 rounded-xl bg-zinc-800 text-zinc-500 hover:text-white transition-all">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {filteredPatients.length === 0 && (
                        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
                            <p className="text-zinc-600 font-medium italic">No patients found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Patient Modal */}
            <Modal
                isOpen={isAddPatientOpen}
                onClose={() => setIsAddPatientOpen(false)}
                title="Register New Patient"
            >
                <div className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Patient Full Name</label>
                        <input
                            type="text"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:border-primary focus:outline-none transition-all"
                            value={newPatient.name}
                            onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                            placeholder="e.g. Sarah Connor"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Age</label>
                            <input
                                type="number"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:border-primary focus:outline-none transition-all"
                                value={newPatient.age}
                                onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Current Status</label>
                            <select
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:border-primary focus:outline-none transition-all"
                                value={newPatient.status}
                                onChange={(e) => setNewPatient({ ...newPatient, status: e.target.value })}
                            >
                                <option>Stable</option>
                                <option>Recovering</option>
                                <option>Critical</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Medical Condition</label>
                        <input
                            type="text"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:border-primary focus:outline-none transition-all"
                            value={newPatient.condition}
                            onChange={(e) => setNewPatient({ ...newPatient, condition: e.target.value })}
                            placeholder="e.g. Hypertension"
                        />
                    </div>
                    <Button className="w-full h-12 rounded-xl mt-4" onClick={handleAddPatient}>
                        Create Record
                    </Button>
                </div>
            </Modal>

            {/* Prescriptions Modal */}
            <Modal
                isOpen={isPrescriptionOpen}
                onClose={() => setIsPrescriptionOpen(false)}
                title={`Prescriptions: ${selectedPatient?.name}`}
            >
                <div className="space-y-6">
                    {/* Add Prescription Form */}
                    <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10">
                        <h4 className="font-bold text-primary mb-4 text-[10px] uppercase tracking-widest flex items-center gap-2">
                            <Plus size={14} /> New Prescription
                        </h4>
                        <div className="space-y-3 mb-4">
                            <input
                                type="text"
                                placeholder="Medicine Name"
                                className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none transition-all"
                                value={newPrescription.medicine}
                                onChange={(e) => setNewPrescription({ ...newPrescription, medicine: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    placeholder="Dosage (e.g. 500mg)"
                                    className="bg-black/40 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none transition-all"
                                    value={newPrescription.dosage}
                                    onChange={(e) => setNewPrescription({ ...newPrescription, dosage: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Frequency (e.g. 2x daily)"
                                    className="bg-black/40 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none transition-all"
                                    value={newPrescription.frequency}
                                    onChange={(e) => setNewPrescription({ ...newPrescription, frequency: e.target.value })}
                                />
                            </div>
                        </div>
                        <Button
                            className="w-full rounded-xl"
                            size="sm"
                            onClick={handleAddPrescription}
                            disabled={!newPrescription.medicine}
                        >
                            Add Prescription
                        </Button>
                    </div>

                    {/* List */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="font-bold text-zinc-500 text-[10px] uppercase tracking-widest">Medical History</h4>
                            <span className="bg-zinc-800 text-zinc-400 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold">
                                {selectedPatient?.prescriptions.length || 0} Records
                            </span>
                        </div>

                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                            {selectedPatient?.prescriptions.length === 0 ? (
                                <p className="text-zinc-600 text-sm italic text-center py-6 border border-dashed border-zinc-800 rounded-xl">No active prescriptions.</p>
                            ) : (
                                selectedPatient?.prescriptions.map((p) => (
                                    <div key={p.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3.5 flex justify-between items-center group/item hover:bg-zinc-800/80 transition-all">
                                        <div>
                                            <div className="font-bold text-white group-hover/item:text-primary transition-colors">{p.medicine} <span className="text-zinc-500 text-sm font-normal">({p.dosage})</span></div>
                                            <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mt-1">{p.frequency} • {p.date}</div>
                                        </div>
                                        <div className="w-9 h-9 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary/60 group-hover/item:text-primary group-hover/item:border-primary/30 transition-all">
                                            <FileText size={18} />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </Modal>
        </AIToolsLayout>
    );
}
