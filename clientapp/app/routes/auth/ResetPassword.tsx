import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { CheckCheck, Send } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { toast } from "react-toastify/unstyled";
import { api } from "utils/ApiHelper";

export default function ResetPassword() {

    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [reseted, setReseted] = useState(false)

    const [searchParams] = useSearchParams()

    const code = searchParams.get("code")

    const { t } = useTranslation("verify")

    const handleResetPassword = () => {
        if (!newPassword || !confirmPassword) {
            toast.error(t("new_password"))
            return
        }
        if (newPassword != confirmPassword) {
            toast.error(t("not_equal"))
            return
        }
        if (newPassword.length < 6 ||
            !newPassword.match(/[0-9]/) ||
            !newPassword.match(/[a-z]/) ||
            !newPassword.match(/[A-Z]/) ||
            !newPassword.match(/[^a-zA-Z0-9]/)) {
            toast.error(t("not_enough"))
            return
        }

        api.user.resetPassword({
            code: code ?? "",
            new_password: confirmPassword
        }).then(() => {
            setReseted(true)
        })
    }

    if (!searchParams.has("code") || code?.trim().length == 0) {
        return (
            <div className="w-screen h-screen flex items-center justify-center">
                <span className="font-bold text-2xl">{t("miss_code")}</span>
            </div>
        )
    }

    return (
        <div className="w-screen h-screen flex items-center justify-center select-none">

            {!reseted ? (
                <div className="w-full flex flex-col p-8 border-1 bg-background/40 z-[5] rounded-2xl max-w-lg gap-4">
                    <span className="text-xl font-bold">{t("reset_password")}</span>
                    <div className="flex flex-col gap-2">
                        <span className="text-sm text-muted-foreground">{t("new_password")}</span>
                        <Input placeholder={t("new_password")} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}></Input>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-sm text-muted-foreground">{t("check_password")}</span>
                        <Input placeholder={t("check_password")} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></Input>
                    </div>
                    <div className="flex justify-end">
                        <Button variant="outline"
                            onClick={handleResetPassword}
                        >
                            <Send />
                            {t("reset_password")}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="w-full flex flex-col p-8 border-1 bg-background/40 z-[5] rounded-2xl max-w-lg gap-4 items-center justify-center">
                    <CheckCheck size={64} />
                    <span className="text-xl text-muted-foreground">{t("reset_success")}</span>
                </div>
            )}
        </div>
    )
}