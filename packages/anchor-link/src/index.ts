// export library
export * from './index-module'

// default export is Link class for convenience
import {Link} from './index-module'
export default Link

// expose dependencies
export * from '@amax/signing-request'
export * from '@amax/amaxjs-core'
