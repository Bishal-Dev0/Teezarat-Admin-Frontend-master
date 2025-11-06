import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

const SweetAlert = {
  success: (key, message) => Swal.fire(key, message, 'success'),
  failed: (key, message) => Swal.fire(key, message, 'error'),
}

export default SweetAlert
