import { supabase, Mission, Contract } from '../lib/supabase'

export interface ContractData {
  mission: Mission
  candidate: any
  employer: any
}

export const contractService = {
  // Générer un contrat pour une mission
  async generateContract(missionId: string): Promise<{ contract: Contract | null; error: any }> {
    try {
      // Récupérer les informations de la mission
      const { data: mission, error: missionError } = await supabase
        .from('missions')
        .select(`
          *,
          profiles!missions_employer_id_fkey (*)
        `)
        .eq('id', missionId)
        .single()

      if (missionError || !mission) {
        return { contract: null, error: missionError || new Error('Mission non trouvée') }
      }

      // Trouver le candidat accepté
      const { data: application, error: appError } = await supabase
        .from('applications')
        .select(`
          *,
          profiles!applications_candidate_id_fkey (*)
        `)
        .eq('mission_id', missionId)
        .eq('status', 'accepté')
        .single()

      if (appError || !application) {
        return { contract: null, error: appError || new Error('Candidat accepté non trouvé') }
      }

      // Générer le contenu du contrat
      const contractContent = this.generateContractHTML({
        mission,
        candidate: application.profiles,
        employer: mission.profiles
      })

      // Pour cette version, on stocke le HTML directement
      // Dans une version production, on convertirait en PDF
      const contractData = {
        mission_id: missionId,
        contract_pdf_url: null, // sera rempli après génération PDF
      }

      const { data: contract, error: contractError } = await supabase
        .from('contracts')
        .insert(contractData)
        .select()
        .single()

      if (contractError) {
        return { contract: null, error: contractError }
      }

      // TODO: Convertir HTML en PDF et stocker dans Supabase Storage
      // await this.convertToPDF(contractContent, contract.id)

      return { contract, error: null }
    } catch (error) {
      return { contract: null, error }
    }
  },

  // Générer le HTML du contrat
  generateContractHTML({ mission, candidate, employer }: ContractData): string {
    const startDate = new Date(mission.start_date).toLocaleDateString('fr-FR')
    const endDate = mission.end_date
      ? new Date(mission.end_date).toLocaleDateString('fr-FR')
      : 'Non définie'

    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contrat d'Intérim - PharmaFlux</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .section { margin-bottom: 30px; }
        .parties { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .party { flex: 1; margin: 0 10px; }
        .signature-area { margin-top: 50px; display: flex; justify-content: space-between; }
        .signature-box { border: 1px solid #ccc; padding: 40px; text-align: center; width: 200px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>CONTRAT DE TRAVAIL TEMPORAIRE</h1>
        <h2>Mission Pharmaceutique</h2>
        <p><strong>PharmaFlux - Plateforme d'Intérim Pharmaceutique</strong></p>
      </div>

      <div class="parties">
        <div class="party">
          <h3>EMPLOYEUR</h3>
          <p><strong>Nom/Raison sociale :</strong> ${employer?.name || 'Non renseigné'}</p>
          <p><strong>Email :</strong> ${employer?.email}</p>
          <p><strong>Adresse :</strong> ${mission.location}</p>
        </div>

        <div class="party">
          <h3>INTÉRIMAIRE</h3>
          <p><strong>Nom :</strong> ${candidate?.name || 'Non renseigné'}</p>
          <p><strong>Email :</strong> ${candidate?.email}</p>
        </div>
      </div>

      <div class="section">
        <h3>ARTICLE 1 - OBJET DE LA MISSION</h3>
        <p><strong>Poste :</strong> ${mission.title}</p>
        <p><strong>Type d'établissement :</strong> ${mission.type}</p>
        <p><strong>Description :</strong></p>
        <p>${mission.description || 'Mission de remplacement pharmaceutique'}</p>
      </div>

      <div class="section">
        <h3>ARTICLE 2 - DURÉE ET HORAIRES</h3>
        <table>
          <tr><th>Date de début</th><td>${startDate}</td></tr>
          <tr><th>Date de fin</th><td>${endDate}</td></tr>
          <tr><th>Heure de début</th><td>${mission.start_time}</td></tr>
          <tr><th>Heure de fin</th><td>${mission.end_time}</td></tr>
        </table>
      </div>

      <div class="section">
        <h3>ARTICLE 3 - RÉMUNÉRATION</h3>
        <p><strong>Taux horaire brut :</strong> ${mission.hourly_rate} €/heure</p>
        <p>La rémunération sera versée conformément à la convention collective de la pharmacie.</p>
      </div>

      <div class="section">
        <h3>ARTICLE 4 - OBLIGATIONS LÉGALES</h3>
        <p>Cette mission d'intérim respecte :</p>
        <ul>
          <li>Les dispositions du Code du travail relatives au travail temporaire</li>
          <li>La convention collective nationale de la pharmacie d'officine</li>
          <li>Le respect des plafonds d'heures légaux (48h/semaine maximum)</li>
          <li>Les obligations de l'Ordre des Pharmaciens</li>
        </ul>
      </div>

      <div class="section">
        <h3>ARTICLE 5 - MENTIONS OBLIGATOIRES</h3>
        <p>Numéro URSSAF : [À compléter]</p>
        <p>Convention collective applicable : Pharmacie d'officine</p>
        <p>Organisme de prévoyance : [À compléter]</p>
      </div>

      <div class="signature-area">
        <div class="signature-box">
          <p><strong>L'EMPLOYEUR</strong></p>
          <br><br><br>
          <p>Date et signature</p>
        </div>

        <div class="signature-box">
          <p><strong>L'INTÉRIMAIRE</strong></p>
          <br><br><br>
          <p>Date et signature</p>
        </div>
      </div>

      <div class="section" style="margin-top: 40px; font-size: 12px; color: #666;">
        <p><strong>Contrat généré par PharmaFlux</strong> - ${new Date().toLocaleDateString('fr-FR')}</p>
        <p>Pour toute question, contactez notre support : support@pharmaflux.com</p>
      </div>
    </body>
    </html>
    `
  },

  // Récupérer un contrat
  async getContract(missionId: string): Promise<{ contract: Contract | null; error: any }> {
    try {
      const { data: contract, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('mission_id', missionId)
        .single()

      return { contract, error }
    } catch (error) {
      return { contract: null, error }
    }
  },

  // Marquer un contrat comme signé
  async signContract(
    contractId: string,
    signerType: 'candidate' | 'employer'
  ): Promise<{ success: boolean; error: any }> {
    try {
      const updateData = signerType === 'candidate'
        ? { signed_by_candidate_at: new Date().toISOString() }
        : { signed_by_employer_at: new Date().toISOString() }

      const { error } = await supabase
        .from('contracts')
        .update(updateData)
        .eq('id', contractId)

      return { success: !error, error }
    } catch (error) {
      return { success: false, error }
    }
  }
}