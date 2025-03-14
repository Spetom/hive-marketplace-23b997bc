
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { sendContactMessage } from '@/lib/emailService';
import { toast } from 'sonner';

// Validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: 'Le nom est requis (minimum 2 caractères)' }),
  email: z.string().email({ message: 'Email invalide' }),
  phone: z.string().optional(),
  subject: z.string().min(3, { message: 'Le sujet est requis (minimum 3 caractères)' }),
  message: z.string().min(10, { message: 'Le message doit contenir au moins 10 caractères' })
});

type FormValues = z.infer<typeof formSchema>;

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    }
  });
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const success = await sendContactMessage({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message
      });
      
      if (success) {
        toast.success('Message envoyé avec succès! Nous vous répondrons bientôt.');
        form.reset();
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast.error('Une erreur est survenue. Veuillez réessayer plus tard.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom complet</FormLabel>
                <FormControl>
                  <Input placeholder="Votre nom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="votre-email@exemple.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone (optionnel)</FormLabel>
                <FormControl>
                  <Input placeholder="+229 XXXXXXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sujet</FormLabel>
                <FormControl>
                  <Input placeholder="Sujet de votre message" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Votre message ici..." 
                  className="min-h-32" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit"
          className="w-full md:w-auto bg-ruche-gold hover:bg-ruche-gold-light text-ruche-purple"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
        </Button>
      </form>
    </Form>
  );
};

export default ContactForm;
