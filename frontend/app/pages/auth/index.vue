<script setup lang="ts">
import { AUTH_ROUTES } from '~/constants/routes'

await navigateTo(AUTH_ROUTES.login, { replace: true })
</script>
