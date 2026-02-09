'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Search, Plus, FileText, Pill, User } from 'lucide-react';

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
        // Update selected patient too to reflect changes in modal immediately if we were using it there
        // But since we close/re-open or just refresh selectedPatient, we need to handle it.
        // Actually, let's update selectedPatient directly
        setSelectedPatient({ ...selectedPatient, prescriptions: [prescription, ...selectedPatient.prescriptions] });

        setNewPrescription({ medicine: '', dosage: '', frequency: '' });
    };

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            <section className="pt-32 pb-20 container">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">
                            Medical Tools
                        </span>
                        <h1 className="text-3xl md:text-4xl font-bold">
                            Patient <span className="text-primary">Registry</span>
                        </h1>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search patients..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:border-primary focus:outline-none transition-colors"
                            />
                        </div>
                        <Button onClick={() => setIsAddPatientOpen(true)}>
                            <Plus size={18} className="mr-2" /> Add Patient
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4">
                    {filteredPatients.map((patient) => (
                        <Card key={patient.id} className="p-4 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{patient.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                                        <span>{patient.age} yrs</span>
                                        <span>•</span>
                                        <span>{patient.condition}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                <div className="text-right hidden md:block">
                                    <div className="text-xs text-zinc-500 mb-1">Last Visit</div>
                                    <div className="text-sm font-medium">{patient.lastVisit}</div>
                                </div>

                                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${patient.status === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
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
                                        className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                        title="View/Add Prescription"
                                    >
                                        <Pill size={20} />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {filteredPatients.length === 0 && (
                        <div className="text-center py-20 text-zinc-500">
                            No patients found matching your search.
                        </div>
                    )}
                </div>
            </section>

            <Footer />

            {/* Add Patient Modal */}
            <Modal
                isOpen={isAddPatientOpen}
                onClose={() => setIsAddPatientOpen(false)}
                title="Add New Patient"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-zinc-400 mb-1">Full Name</label>
                        <input
                            type="text"
                            className="w-full bg-black border border-zinc-800 rounded-lg p-2 text-white focus:border-primary focus:outline-none"
                            value={newPatient.name}
                            onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-zinc-400 mb-1">Age</label>
                            <input
                                type="number"
                                className="w-full bg-black border border-zinc-800 rounded-lg p-2 text-white focus:border-primary focus:outline-none"
                                value={newPatient.age}
                                onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-zinc-400 mb-1">Status</label>
                            <select
                                className="w-full bg-black border border-zinc-800 rounded-lg p-2 text-white focus:border-primary focus:outline-none"
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
                        <label className="block text-sm text-zinc-400 mb-1">Condition</label>
                        <input
                            type="text"
                            className="w-full bg-black border border-zinc-800 rounded-lg p-2 text-white focus:border-primary focus:outline-none"
                            value={newPatient.condition}
                            onChange={(e) => setNewPatient({ ...newPatient, condition: e.target.value })}
                        />
                    </div>
                    <Button className="w-full mt-4" onClick={handleAddPatient}>
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
                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                        <h4 className="font-bold text-primary mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                            <Plus size={16} /> New Prescription
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                            <input
                                type="text"
                                placeholder="Medicine Name"
                                className="bg-black border border-zinc-800 rounded-lg p-2 text-sm text-white focus:border-primary focus:outline-none"
                                value={newPrescription.medicine}
                                onChange={(e) => setNewPrescription({ ...newPrescription, medicine: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Dosage (e.g. 500mg)"
                                className="bg-black border border-zinc-800 rounded-lg p-2 text-sm text-white focus:border-primary focus:outline-none"
                                value={newPrescription.dosage}
                                onChange={(e) => setNewPrescription({ ...newPrescription, dosage: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Frequency (e.g. 2x daily)"
                                className="bg-black border border-zinc-800 rounded-lg p-2 text-sm text-white focus:border-primary focus:outline-none"
                                value={newPrescription.frequency}
                                onChange={(e) => setNewPrescription({ ...newPrescription, frequency: e.target.value })}
                            />
                        </div>
                        <Button
                            className="w-full"
                            size="sm"
                            onClick={handleAddPrescription}
                            disabled={!newPrescription.medicine}
                        >
                            Add Prescription
                        </Button>
                    </div>

                    {/* List */}
                    <div className="space-y-3">
                        <h4 className="font-bold text-zinc-400 text-sm uppercase tracking-wider">History</h4>
                        {selectedPatient?.prescriptions.length === 0 ? (
                            <p className="text-zinc-500 text-center py-4">No active prescriptions.</p>
                        ) : (
                            selectedPatient?.prescriptions.map((p) => (
                                <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex justify-between items-center">
                                    <div>
                                        <div className="font-bold text-white">{p.medicine} <span className="text-zinc-500 text-sm font-normal">({p.dosage})</span></div>
                                        <div className="text-xs text-zinc-400">{p.frequency} • Prescribed: {p.date}</div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <FileText size={16} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </Modal>
        </main>
    );
}
