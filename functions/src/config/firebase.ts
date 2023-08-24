import * as admin from 'firebase-admin'
import * as firebase from 'firebase/app'
import * as authentication from 'firebase/auth'

const config = {
  apiKey: 'AIzaSyB4jCiZBX6-OYiJUBHcuWwXaPXHUWeVQ9s',
  authDomain: 'civicbase-functions.firebaseapp.com',
  projectId: 'civicbase-functions',
  storageBucket: 'civicbase-functions.appspot.com',
  messagingSenderId: '436253743444',
  appId: '1:436253743444:web:179fa9379371509c5510c1',
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'civicbase-functions',
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDYSWiDn0MuDtp8\nAtcMeUzv1xMjaw+f+Oy6VkKc/rzc2kBJ6dZrMXqqeVNttegVa6tDsenB4LUTl/29\nfjYhD1JIBd5HfnEzZw8TfO9QvmGHmdGA7h6VgiGuJcpdybGgWBE+Zw7ZipeUrb8U\nGOyCKxzjba/VMDTv1tuIqrWaGY8ZDskx1trRZ+h+MQ0EUfslfOQduqiqm+Lbf/6S\nJRbwLYW6yGNe4X+NCMkrcVq8nkS2ww6TmgZ1A1AaP29Qym+z8h+dOecMrkF1+1Xc\nA4EtZfE9zeOmCOp+4F7RA/VHp5m9hwGteUyfQiX+ZEP4xdflvnFr4CKzjon/Lg5B\nqiO0jATdAgMBAAECggEABnsWoGEIjov/5HjiUDufQE2Jw4Us++5ly4STrOgeKSD6\nDazt0ZrzMcH+a7poaKHoCRh+6GIPEvX6MrAiN5XhsYpJeYtyoWdsZnlXI2x8+Cb2\nBd68uF6kmzcDLBHD2onhBGVqpr6WIayeHeBMT+8yR6dM/j6aS3h87gitdd9fsBC4\n9s+AmOSPmmW1d9HinMkdWi+N4ZujoOV2GCfStms/VnM980zbuvqZyPZT22XyRLHo\n3S53S41A8W+RS4wp1rKEuf+VQk5IYjR+kkv9e4QGh6lnC+wweXxof0cjDlW39fTs\n/lUEflUugT7akZA3bEZlDCcMxX3WDeyzJF2CvJIiAQKBgQD9vua1xJzyNSUlCW8Y\nJ6wm3YWxzGh3hi7v2PRweg1ZaG+5I+/IZHDHpKxOxaxp1vzxa4s3mMDtB6Z550Ow\n7lHGDPGfZJDPoqWxwJgfSUu3Jw9qr5ulVohXuEaYnUL0iQbXgawcQEwHczqpaKpk\nk3dlTKv3twqJlFdJg5IFlTZyAQKBgQDaNVA78TupR2itR8lxMe5QSyMQM9BgvJW6\nM1F0JHVln3poyFj9zckV895krf/x7g7ZQhZfRHpg5Z71M6BxB1kNIt4ZMmRWWmgE\nzGEDxK8YZfLA4Whcw1P0waPMyAPP+UxRxI1/Md2ZhJClr+lDN/fPVYURZbRT4Xf0\nFp+NJfea3QKBgHUrD3Fjhm05KRu/DXOD7jRMGg4Nqzd12HqcHdNKKJveY6iD9Zb8\n+i7V1VLSaFi/EzGPTUuw13UcET09Er7CbTQcif3l/BBEtGot2pCn0bSS7sV+rUpd\neLu4tbCG/YHZPDWLBSROdE0EYlQTpoqmpX07ODU8ajs5Kk0h2e2GBwwBAoGAOVnz\n2Z1gyfAr0gdhKbAu68mj0Jldtl86lzLvwK/obypIWQv3X9XbeTqchCe7cpHYM0AM\nc0OjSp5vdhD4pVyCClLUvxigiJXAaypwgTYLs0TwVcOo02C/S0At1h/n6Jykc4VO\nj1TC4puWDQY8L9+g8UyP6e+qQrWq+muLyeRlvL0CgYA53jop+dRJuWRBTdTUDt4y\nO1VmTtOJ+6MXgA6J5fU5P3s81LjpK7KfTb2Wqs0Y5pfFb3AP9wCG4wkOzVWaOY+3\nOsqh7U00PweBOQcEbGII4l0RVnfr31R0zu41aB4WgqcQaLAbNyvp1ssrUX9f+2wb\nEuD7aTYSmaja3pwLvqf1rw==\n-----END PRIVATE KEY-----\n'.replace(
        /\\n/g,
        '\n',
      ),
    clientEmail: 'firebase-adminsdk-1v5bw@civicbase-functions.iam.gserviceaccount.com',
  }),
  databaseURL: 'https://civicbase-functions.firebaseio.com',
  projectId: 'civicbase-functions',
})

const app = firebase.initializeApp(config)
const auth = authentication.initializeAuth(app)

const db = admin.firestore()

export { admin, db, firebase, config, auth }
