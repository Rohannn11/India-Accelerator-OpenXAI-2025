import React, { useState } from 'react';
import { Phone, AlertTriangle, MapPin, Clock, User, Plus, Edit, Trash } from 'lucide-react';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

interface EmergencyContactProps {
  onClose: () => void;
}

export function EmergencyContact({ onClose }: EmergencyContactProps) {
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'Emergency Services',
      phone: '911',
      relationship: 'Emergency',
      isPrimary: true
    },
    {
      id: '2',
      name: 'Local Hospital',
      phone: '(555) 123-4567',
      relationship: 'Medical',
      isPrimary: false
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleAddContact = (contact: Omit<EmergencyContact, 'id'>) => {
    const newContact: EmergencyContact = {
      ...contact,
      id: Date.now().toString()
    };
    setContacts([...contacts, newContact]);
    setShowAddForm(false);
  };

  const handleEditContact = (contact: EmergencyContact) => {
    setEditingContact(contact);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const handleUpdateContact = (updatedContact: EmergencyContact) => {
    setContacts(contacts.map(c => c.id === updatedContact.id ? updatedContact : c));
    setEditingContact(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Emergency Contacts</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-red-100 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleCall('911')}
              className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Phone className="w-5 h-5" />
              <span className="font-medium">Call 911</span>
            </button>
            <button
              onClick={() => handleCall('(555) 123-4567')}
              className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <MapPin className="w-5 h-5" />
              <span className="font-medium">Local Hospital</span>
            </button>
          </div>

          {/* Emergency Info */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p className="font-medium mb-1">When to call 911:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Chest pain or pressure</li>
                  <li>• Difficulty breathing</li>
                  <li>• Severe bleeding</li>
                  <li>• Loss of consciousness</li>
                  <li>• Signs of stroke</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Your Contacts</h3>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-2">
              {contacts.map((contact) => (
                <div key={contact.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{contact.name}</h4>
                        {contact.isPrimary && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{contact.relationship}</p>
                      <p className="text-sm text-gray-600">{contact.phone}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCall(contact.phone)}
                        className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditContact(contact)}
                        className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {!contact.isPrimary && (
                        <button
                          onClick={() => handleDeleteContact(contact.id)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Contact Form */}
          {showAddForm && (
            <AddContactForm
              onAdd={handleAddContact}
              onCancel={() => setShowAddForm(false)}
            />
          )}

          {/* Edit Contact Form */}
          {editingContact && (
            <EditContactForm
              contact={editingContact}
              onUpdate={handleUpdateContact}
              onCancel={() => setEditingContact(null)}
            />
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            Keep your emergency contacts updated for quick access during medical emergencies.
          </p>
        </div>
      </div>
    </div>
  );
}

interface AddContactFormProps {
  onAdd: (contact: Omit<EmergencyContact, 'id'>) => void;
  onCancel: () => void;
}

function AddContactForm({ onAdd, onCancel }: AddContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relationship: '',
    isPrimary: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone) {
      onAdd(formData);
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h4 className="font-medium text-gray-900 mb-3">Add Emergency Contact</h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Contact Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <input
          type="text"
          placeholder="Relationship"
          value={formData.relationship}
          onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPrimary"
            checked={formData.isPrimary}
            onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
            className="rounded"
          />
          <label htmlFor="isPrimary" className="text-sm text-gray-700">
            Set as primary contact
          </label>
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Contact
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

interface EditContactFormProps {
  contact: EmergencyContact;
  onUpdate: (contact: EmergencyContact) => void;
  onCancel: () => void;
}

function EditContactForm({ contact, onUpdate, onCancel }: EditContactFormProps) {
  const [formData, setFormData] = useState(contact);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone) {
      onUpdate(formData);
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h4 className="font-medium text-gray-900 mb-3">Edit Contact</h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Contact Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <input
          type="text"
          placeholder="Relationship"
          value={formData.relationship}
          onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPrimaryEdit"
            checked={formData.isPrimary}
            onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
            className="rounded"
          />
          <label htmlFor="isPrimaryEdit" className="text-sm text-gray-700">
            Set as primary contact
          </label>
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update Contact
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
