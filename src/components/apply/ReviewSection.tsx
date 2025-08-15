import React from 'react';
import { User, Mail, Phone, MapPin, Globe, IdCard, Hash, MessageSquare, Camera, Shield } from 'lucide-react';

interface ReviewSectionProps {
  formData: any;
  imagePreview: string | null;
  idImagePreview: string | null;
}

const ReviewSection = ({ formData, imagePreview, idImagePreview }: ReviewSectionProps) => {
  const sections = [
    {
      title: "Personal Information",
      icon: User,
      color: "from-blue-500 to-blue-600",
      fields: [
        { label: "Full Name", value: formData.name, icon: User },
        { label: "Email", value: formData.email, icon: Mail },
        { label: "Phone", value: formData.phone, icon: Phone },
      ]
    },
    {
      title: "Location Information",
      icon: MapPin,
      color: "from-green-500 to-green-600",
      fields: [
        { label: "Address/Location", value: formData.location, icon: MapPin },
        { label: "Region", value: formData.region, icon: Globe },
      ]
    },
    {
      title: "Verification & Identification",
      icon: Shield,
      color: "from-purple-500 to-purple-600",
      fields: [
        { label: "ID Type", value: formData.idType, icon: IdCard },
        { label: "ID Number", value: formData.idNumber, icon: Hash },
      ]
    },
    {
      title: "About You",
      icon: MessageSquare,
      color: "from-orange-500 to-orange-600",
      fields: [
        { label: "Description", value: formData.about, icon: MessageSquare, isTextarea: true },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Review Your Application</h2>
          <p className="text-gray-600">Please review all information before submitting</p>
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 bg-gradient-to-br ${section.color} rounded-lg flex items-center justify-center`}>
                <section.icon size={20} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
            </div>
            
            <div className="space-y-3">
              {section.fields.map((field, fieldIndex) => (
                <div key={fieldIndex} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <field.icon size={18} className="text-ghana-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">{field.label}</p>
                    {field.isTextarea ? (
                      <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{field.value}</p>
                    ) : (
                      <p className="text-sm text-gray-900">{field.value || "Not provided"}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Images Review */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Camera size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Uploaded Images</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Profile Image</p>
              {imagePreview ? (
                <div className="w-32 h-32 rounded-lg overflow-hidden border">
                  <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center border">
                  <User size={32} className="text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">ID Document</p>
              {idImagePreview ? (
                <div className="w-40 h-24 rounded-lg overflow-hidden border">
                  <img src={idImagePreview} alt="ID Document" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-40 h-24 rounded-lg bg-gray-100 flex items-center justify-center border">
                  <IdCard size={24} className="text-gray-400" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Message */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-green-800">Ready to Submit</p>
            <p className="text-sm text-green-700 mt-1">
              All information has been reviewed. Click submit to complete your application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
