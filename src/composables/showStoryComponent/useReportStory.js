import Swal from "sweetalert2";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useReportStory() {
  const reportStory = async (storyUuid) => {
    Swal.fire({
      title: 'Report Story',
      html: `
        <input type="text" id="report-reason" class="swal2-input" placeholder="Reason for report">
        <textarea id="report-details" class="swal2-textarea" placeholder="Details (optional)"></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: 'Submit Report',
      preConfirm: async () => {
        const reason = document.getElementById('report-reason').value
        const details = document.getElementById('report-details').value
        const userUuid = null
  
        if (!reason) {
          Swal.showValidationMessage('Reason is required')
          return false
        }
  
        try {
          const response = await fetch(`${API_BASE_URL}/stories/${storyUuid}/report`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reason, details, user_uuid: userUuid }),
          })
  
          if (!response.ok) {
            const errorData = await response.json()
            Swal.showValidationMessage(errorData.message || 'Failed to report story')
            return false
          }
          return response.json()
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`)
          return
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Reported!', 'The story has been reported.', 'success')
      }
    })
  }
  return { reportStory }
}