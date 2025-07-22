import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Mail, Linkedin, Github } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Basic validation
      if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
        throw new Error('Please fill in all required fields');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        throw new Error('Please enter a valid email address');
      }

      // Debug log
      console.log('Submitting contact form:', formData);
      
      // Insert message into database
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: formData.name.trim(),
            email: formData.email.trim(),
            subject: formData.subject.trim() || 'No Subject',
            message: formData.message.trim(),
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        console.error('Error submitting contact form:', error);
        throw new Error(error.message || 'Failed to send message. Please try again later.');
      }

      console.log('Message sent successfully:', data);
      
      toast({
        title: "Message sent!",
        description: "Thank you for your message. We'll get back to you soon.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error: any) {
      console.error('Contact form error:', error);
      
      toast({
        title: "Error sending message",
        description: error.message || 'An unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="dsa-heading mb-8 text-center">Contact Me</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Contact Form */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="text-sm font-medium mb-1 block">Name</label>
                  <Input 
                    id="name" 
                    name="name"
                    placeholder="Your name" 
                    className="w-full" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="text-sm font-medium mb-1 block">Email</label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="Your email" 
                    className="w-full" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="text-sm font-medium mb-1 block">Subject</label>
                  <Input 
                    id="subject" 
                    name="subject"
                    placeholder="Message subject" 
                    className="w-full" 
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="text-sm font-medium mb-1 block">Message</label>
                  <Textarea 
                    id="message" 
                    name="message"
                    placeholder="Your message" 
                    rows={5} 
                    className="w-full" 
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-dsa-purple hover:bg-dsa-purple/90"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Contact Info */}
          <div className="flex flex-col space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                <p className="text-muted-foreground mb-6">
                  Feel free to reach out to me through any of the contact methods below. I'm always open to discussing new projects, opportunities, or just chatting about technology.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-dsa-purple/10 p-2 rounded-full">
                      <Mail className="h-5 w-5 text-dsa-purple" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <a href="mailto:contact.chahar@gmail.com" className="text-dsa-purple hover:underline">
                        contact.chahar@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-dsa-purple/10 p-2 rounded-full">
                      <Linkedin className="h-5 w-5 text-dsa-purple" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">LinkedIn</p>
                      <a href="https://linkedin.com/in/imsurajchahar" target="_blank" rel="noopener noreferrer" className="text-dsa-purple hover:underline">
                        Suraj Singh Chahar
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-dsa-purple/10 p-2 rounded-full">
                      <Github className="h-5 w-5 text-dsa-purple" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">GitHub</p>
                      <a href="https://github.com/iamsurajchahar" target="_blank" rel="noopener noreferrer" className="text-dsa-purple hover:underline">
                        Suraj Singh Chahar
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">Connect With Me</h2>
                <p className="text-muted-foreground mb-4">
                  I'm always looking to expand my network and connect with like-minded individuals interested in DSA, software development, and computer science.
                </p>
                <div className="flex gap-3 mt-4">
                  <Button variant="outline" className="flex-1" asChild>
                    <a href="https://github.com/iamsurajchahar" target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" /> GitHub
                    </a>
                  </Button>
                  <Button variant="outline" className="flex-1" asChild>
                    <a href="https://linkedin.com/in/imsurajchahar" target="_blank" rel="noopener noreferrer">
                      <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
